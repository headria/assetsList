import {
  ArabCoin,
  TotalBalanceArab,
  TransactionStatus,
  transactionTypeStatus,
} from "../interfaces/arabcoin";
import { LoggerService } from "../logger";
import ArabCoinModel, { ArabCoinDTO } from "../models/arabcoin";
import nomics from "../thirdparty/nomics";

/**
 * TODO - write function that check transactions and then update the database.
 * TODO - Get balance for addresses
 * TODO - Get Pirce per network
 */

const addressesBlockchain: any = {
  btc: "bc1qfhndl48dpng7vlwltmyq7ulnggk68nzcjkcj5z",
  eth: "0x55140c7Fd926Ef5fC9467aBe40Af73eD60B2d991",
  xrp: "rKR5sSa7k3mgi3vTUQLbW6wfCmZj3csHzg",
  near: "1e350eb8eb9c24deec11c12affca191cfa012d76ec0c6eed6c0e0bd03e3941ee",
  tron: "TNXiVevk6C7iynPn2qCTBLL1YEykxgCZGj",
  bnb: "bnb1ptpgywkgg6ekwsev6t2tm328hgq6j5c7ejt66j",
};
const ethNetworks: string[] = [
  "eth",
  "matic",
  "smartchain",
  "sand",
  "usdt",
  "mana",
  "busd",
  "tron",
];
const selectNetworkAddress = (symbol: string) => {
  const network: string = symbol.toLocaleLowerCase();
  if (ethNetworks.findIndex((s) => s === network) > -1) {
    return addressesBlockchain.eth;
  }

  return addressesBlockchain[network];
};
export const ArabCoinService = {
  getPrice: async (
    symbol: string
  ): Promise<{
    arabCoin: number;
    coinPrice: number;
    coinPricePerArabCoin: number;
    networkAddress?: string;
  }> => {
    try {
      const priceList = await nomics.currenciesTicker({
        ids: [symbol],
        interval: ["1h"],
      });

      const arabCoinPrice: number = 0.035;
      const coinPrice: number = parseFloat(priceList[0].price);
      const coinPricePerArabCoin: number = coinPrice / arabCoinPrice;

      return {
        arabCoin: arabCoinPrice,
        coinPrice,
        coinPricePerArabCoin,
        networkAddress: selectNetworkAddress(symbol),
      };
    } catch (e: any) {
      LoggerService.error(e.toString());
      return {
        arabCoin: 0,
        coinPrice: 0,
        coinPricePerArabCoin: 0,
      };
    }
  },
  addNewRequest: async (
    payloads: ArabCoin
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      await new ArabCoinModel({
        ...payloads,
        status: transactionTypeStatus["new"],
        check_count: 0,
      }).save();
      return {
        message: "",
        success: true,
      };
    } catch (e: any) {
      LoggerService.error(e.toString());
      return {
        message: "There was problem occured on the server.",
        success: false,
      };
    }
  },
  checkAmount: async (amount: number): Promise<boolean> => {
    try {
      const convertedAmount = Number(amount);
      const sumArabBalance = await ArabCoinModel.aggregate([
        {
          $match: { status: "Success" },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$amount_arb" },
          },
        },
      ]);

      const newAmount = await ArabCoinService.getUnConfirmedAmount();
      const totalAmount: number = 300000000;

      const diff: number =
        totalAmount -
        (convertedAmount +
          newAmount +
          (Number(sumArabBalance[0]?.totalAmount) || 0));
      if (diff >= 0) return true;
      else return false;
    } catch (e: any) {
      LoggerService.error(`[checkAmount] err:${e.toString()}`);
      return false;
    }
  },
  getTotalArabCoin: async (): Promise<Number> => {
    try {
      const sumArabBalance: TotalBalanceArab[] = await ArabCoinModel.aggregate([
        {
          $match: { status: transactionTypeStatus["success"] },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$amount_arb" },
          },
        },
      ]);

      return sumArabBalance.length > 0
        ? Number(sumArabBalance[0].totalAmount) || 0
        : 0;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return 0;
    }
  },
  getBalancePerAddress: async (address: string | string[]): Promise<Number> => {
    try {
      let searchAddress: string[] = [];
      if (typeof address === "string") {
        // check for valid address
        if (address.length < 5) return 0;
        searchAddress = [address];
      }
      if (Array.isArray(address)) {
        searchAddress = address;
      }
      const sumArabBalance: TotalBalanceArab[] = await ArabCoinModel.aggregate([
        {
          $match: {
            status: transactionTypeStatus["success"],
            from: { $in: searchAddress },
          },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$amount_arb" },
          },
        },
      ]);

      return sumArabBalance.length > 0
        ? Number(sumArabBalance[0].totalAmount) || 0
        : 0;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return 0;
    }
  },
  getUnConfirmedAmount: async (): Promise<number> => {
    try {
      const sumArabBalance = await ArabCoinModel.aggregate([
        {
          $match: {
            status: transactionTypeStatus.new,
            check_count: { $lt: 4 },
          },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$amount_arb" },
          },
        },
      ]);

      return Number(sumArabBalance[0]?.totalAmount || 0);
    } catch (e: any) {
      LoggerService.error(e.toString());
      return 0;
    }
  },
  getUnconfirmedTransactions: async (network: string): Promise<ArabCoin[]> => {
    const trxs = await ArabCoinService.getTransactions(
      network,
      "new",
      "pending"
    );
    return trxs;
  },
  getTransactions: async (
    network: string,
    transactionStatus: TransactionStatus,
    transactionStatus2?: TransactionStatus
  ): Promise<ArabCoin[]> => {
    try {
      let filterData: any = {
        network,
        status: transactionTypeStatus[transactionStatus],
      };
      if (transactionStatus2) {
        filterData = {
          network,
          $or: [{ status: transactionStatus }, { status: transactionStatus2 }],
        };
      }

      const trxs = await ArabCoinModel.find(filterData);

      const trxList: ArabCoin[] = trxs.map((tr) => ({
        from: tr.from,
        to: tr.to,
        network: tr.network,
        amount_network: tr.amount_network,
        amount_arb: tr.amount_arb,
        hash: tr.hash,
        check_count: tr.check_count,
      }));
      return trxList;
    } catch (e: any) {
      LoggerService.error(`[getTransactions] err:${e.toString()}`);
      return [];
    }
  },
  updateTransactionStatus: async (
    hash: string,
    checkValidation: boolean,
    check_count: number
  ): Promise<boolean> => {
    try {
      let update: any = {};

      if (checkValidation) {
        update = {
          $set: {
            status: transactionTypeStatus["success"],
          },
        };
      }
      if (!checkValidation && check_count!! > 3) {
        update = {
          $set: {
            status: transactionTypeStatus["failed"],
            check_count: check_count + 1,
          },
        };
      }

      if (!checkValidation && check_count!! < 4) {
        update = {
          $set: {
            status: transactionTypeStatus["pending"],
            check_count: check_count + 1,
          },
        };
      }
      await ArabCoinModel.findOneAndUpdate(
        {
          hash,
        },
        update
      );

      return true;
    } catch (e: any) {
      LoggerService.error(`[updateTransactionStatus] err:${e.toString()}`);
      return false;
    }
  },
};
