import { LoggerService } from "../logger";
import { Boba } from "../services";
import { convertToUnit } from "../utils/convert";

export const BobaController = {
  getAllTx: async (req: any, res: any) => {
    try {
      const query = req.query;

      let txList = [];
      txList = await Boba.accounts.getListTransactions(
        query?.address,
        query?.startblock,
        query?.endblock,
        query?.page,
        query?.offest || 100,
        query?.sort,
        query.contractAddress,
        query?.chain
      );

      txList = txList.filter((x: any) => x.value !== "0");

      return res.status(200).send({ code: 0, message: "", data: txList });
    } catch (error) {
      LoggerService.error(error);
      return res.status(500).send({});
    }
  },

  getBoba20: async (req: any, res: any) => {
    try {
      const query = req.query;

      let result = await Boba.accounts.getBalance(
        query?.address,
        query.contractAddress,
        query?.chain
      );
      const format = convertToUnit(result, "ETH");
      return res.status(200).send({ code: 0, message: "", data: format });
    } catch (error) {
      LoggerService.error(error);
      return res.status(500).send({});
    }
  },
};
