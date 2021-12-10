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
};
