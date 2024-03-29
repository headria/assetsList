import { TokenListServices } from "../services";
import { LoggerService } from "../logger";

export const TokensController = {
  getList: async (req: any, res: any) => {
    try {
      const tokenList = await TokenListServices.getList({});
      res.status(200).send({ code: 0, message: "", data: tokenList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  searchToken: async (req: any, res: any) => {
    try {
      const symbol = req.query?.symbol?.toLocaleLowerCase();
      const tokenList = await TokenListServices.getList({ symbol });
      res.status(200).send({ code: 0, message: "", data: tokenList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getPriceList1H: async (req: any, res: any) => {
    try {
      const symbols = req.query?.symbol?.split(",");
      const tokenList = await TokenListServices.get1HourPirceList({ symbols });
      res.status(200).send({ code: 0, message: "", data: tokenList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getSupprotedTokens: async (req: any, res: any) => {
    try {
      const symbols = req.query?.symbol?.split(",");
      const tokenList = await TokenListServices.getSupportedToken();
      res.status(200).send({ code: 0, message: "", data: tokenList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getTokenInfo: async (req: any, res: any) => {
    try {
      const symbol = req.query?.symbol;
      const tokenInfo = await TokenListServices.getCoinInfo(
        symbol.toUpperCase()
      );
      res.status(200).send({ code: 0, message: "", data: tokenInfo });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getChartData: async (req: any, res: any) => {
    try {
      const query = req.query;
      const chartData = await TokenListServices.getChartData({ ...query });
      res.status(200).send({ code: 0, message: "", data: chartData });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
};
