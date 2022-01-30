import { ArabCoin, TotalBalanceArab } from "../interfaces/arabcoin";
import { LoggerService } from "../logger";
import ArabCoinModel, { ArabCoinDTO } from "../models/arabcoin";
import nomics from "../thirdparty/nomics";

/**
 * TODO - write function that check transactions and then update the database.
 * TODO - Get balance for addresses
 * TODO - Get Pirce per network
 */
export const ArabCoinService = {
  getPrice: async (
    symbol: string
  ): Promise<{
    arabCoin: number;
    coinPrice: number;
    coinPricePerArabCoin: number;
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
  getBalancePerAddress: async (address: string): Promise<Number> => {
    try {
      const sumArabBalance: TotalBalanceArab[] = await ArabCoinModel.aggregate([
        {
          $match: { status: "Success", from: address },
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
