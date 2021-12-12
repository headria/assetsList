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
};
