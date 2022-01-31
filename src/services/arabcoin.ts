import { ArabCoin, TotalBalanceArab } from "../interfaces/arabcoin";
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
      await new ArabCoinModel({ ...payloads, status: "New" }).save();
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
            totalAmount: { $sum: "$balance_arb" },
          },
        },
      ]);
      const totalAmount: number = 300000000;

      const diff: number =
        totalAmount - (convertedAmount + (Number(sumArabBalance) || 0));
      if (diff >= 0) return true;
      else return false;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return false;
    }
  },
  getTotalArabCoin: async (): Promise<Number> => {
    try {
      const sumArabBalance: TotalBalanceArab[] = await ArabCoinModel.aggregate([
        {
          $match: { status: "Success" },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$balance_arb" },
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
          $match: { status: "Success", from: { $in: searchAddress } },
        },
        {
          $group: {
            _id: {},
            totalAmount: { $sum: "$balance_arb" },
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
};
