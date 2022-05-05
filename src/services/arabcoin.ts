import { DevicesService } from ".";
import {
  ArabCoin,
  TotalBalanceArab,
  TransactionStatus,
  transactionTypeStatus,
} from "../interfaces/arabcoin";
import { BodyNotification } from "../interfaces/notification";
import { LoggerService } from "../logger";
import ArabCoinModel, { ArabCoinDTO } from "../models/arabcoin";
import nomics from "../thirdparty/nomics";
import { cacheData, getCachedData } from "../utils";
import { addressesBlockchain } from "../utils/addresses";
import { NotificationService } from "./notifications";

/**
 * TODO - write function that check transactions and then update the database.
 * TODO - Get balance for addresses
 * TODO - Get Pirce per network
 */

const ethNetworks: string[] = [
  "eth",
  "matic",
  "smartchain",
  "sand",
  // "usdt",
  "mana",
  "busd",
  "shib",
  "doge",
];

const selectNetworkAddress = (symbol: string, blcokchain?: string) => {
  const network: string = symbol.toLocaleLowerCase();
  console.log(network);
  if (ethNetworks.findIndex((s) => s === network) > -1) {
    return addressesBlockchain.eth;
  }

  if (network === "usdt") return addressesBlockchain["trx"];
  return addressesBlockchain[network];
};
export const ArabCoinService = {
  getPrice: async (
    symbol2: string
  ): Promise<{
    arabCoin: number;
    coinPrice: number;
    coinPricePerArabCoin: number;
    networkAddress?: string;
  }> => {
    try {
      const symbol = symbol2.toLowerCase() === "smartchain" ? "BNB" : symbol2;
      const cachData = await getCachedData(symbol);
      let priceListData: any = [];
      if (cachData?.cached) priceListData = cachData.payload;
      if (!cachData?.cached) {
        priceListData = await nomics.currenciesTicker({
          ids: [symbol],
          interval: ["1h"],
        });

        // 10 seconds for cache request. when it's removed it will make new request for data
        await cacheData(symbol, JSON.stringify(priceListData), 15 * 60);
      }

      const arabCoinPrice: number = 0.035;
      const coinPrice: number = parseFloat(priceListData[0].price);
      const coinPricePerArabCoin: number = coinPrice / arabCoinPrice;

      return {
        arabCoin: arabCoinPrice,
        coinPrice,
        coinPricePerArabCoin,
        networkAddress: selectNetworkAddress(symbol2),
      };
    } catch (e: any) {
      LoggerService.error(`[arabservice-getPrice] err:${e.toString()}`);
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
          $or: [
            { status: transactionTypeStatus[transactionStatus] },
            { status: transactionTypeStatus[transactionStatus2] },
          ],
        };
      }

      if (network === "BSC") {
        filterData.network = { $in: ["BSC", "BNB"] };
        filterData.hash = { $regex: "^0[xX][0-9a-fA-F]+$" };
        console.log(filterData);
      }

      const trxs = await ArabCoinModel.find({ ...filterData });

      const trxList: ArabCoin[] = trxs.map((tr) => ({
        from: tr.from,
        to: tr.to,
        network: tr.network,
        amount_network: tr.amount_network,
        amount_arb: tr.amount_arb,
        hash: tr.hash,
        check_count: tr.check_count,
        createdAt: tr.createdAt,
      }));
      return trxList;
    } catch (e: any) {
      LoggerService.error(`[getTransactions] err:${e.toString()}`);
      return [];
    }
  },
  getTransactionsByAddress: async (
    address: string | string[]
  ): Promise<ArabCoin[]> => {
    try {
      let searchAddress: string[] = [];
      if (typeof address === "string") {
        // check for valid address
        if (address.length < 5) return [];
        searchAddress = [address];
      }
      if (Array.isArray(address)) {
        searchAddress = address;
      }
      let filterData: any = {
        from: { $in: searchAddress },
        status: transactionTypeStatus["success"],
      };

      const trxs = await ArabCoinModel.find({ ...filterData });

      const trxList: ArabCoin[] = trxs.map((tr) => ({
        from: tr.from,
        to: tr.to,
        network: tr.network,
        amount_network: tr.amount_network,
        amount_arb: tr.amount_arb,
        hash: tr.hash,
        createdAt: tr.createdAt,
        createdAtNumber: tr.createdAt?.getTime(),
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
    reason: string,
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
            rejected_reasons: reason,
          },
        };
      }

      if (!checkValidation && check_count!! < 4) {
        update = {
          $set: {
            status: transactionTypeStatus["pending"],
            check_count: check_count + 1,
            rejected_reasons: reason,
          },
        };
      }
      await ArabCoinModel.findOneAndUpdate(
        {
          hash,
        },
        { ...update }
      );

      return true;
    } catch (e: any) {
      LoggerService.error(`[updateTransactionStatus] err:${e.toString()}`);
      return false;
    }
  },
  sendArabCoinNotification: async (tr: ArabCoin): Promise<boolean> => {
    try {
      const notificationBody: BodyNotification = {
        blcokchain: tr.network,
        date: tr.createdAt?.getTime().toString(),
        from_address: tr.from,
        to_address: tr.to,
        hash: tr.hash,
        netwrokFee: "0",
        nonce: "0",
        status: "success",
        type: "recieve",
        value: tr.amount_arb.toString(),
      };

      // const device = await DevicesService.getDevices({dId:tr.from})
      // await NotificationService.sendNotification()
      return true;
    } catch (e: any) {
      LoggerService.error(`[updateTransactionStatus] err:${e.toString()}`);
      return false;
    }
  },
};
