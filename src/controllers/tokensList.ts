import { TokenListServices } from "../services";

export const TokensController = {
  getList: async (req: any, res: any) => {
    const tokenList = await TokenListServices.getList({});
    res.status(200).send({ code: 0, message: "", data: tokenList });
  },
  searchToken: async (req: any, res: any) => {
    const symbol = req.query?.symbol?.toLocaleLowerCase();
    const tokenList = await TokenListServices.getList({ symbol });
    res.status(200).send({ code: 0, message: "", data: tokenList });
  },
};
