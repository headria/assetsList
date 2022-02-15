import { LoggerService } from "../logger";
import { MaticService } from "../services";
export const MaticController = {
  getAllTx: async (req: any, res: any) => {
    try {
      const query = req.query;

      let txList = [];
      txList = await MaticService.accounts.getListTransactions(
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

      res.status(200).send({ code: 0, message: "", data: txList });
    } catch (error: any) {
      LoggerService.error(
        `[MaticController-getAllTx] err: ${error.toString()}`
      );
      res.status(500).send({});
    }
  },
  getBalanceBEP20: async (req: any, res: any) => {
    try {
      const query = req.query;

      const balance = await MaticService.contracts.getBalanceBEP20(
        query?.contractAddress,
        query?.walletAddress
      );

      res.status(200).send({ code: 0, message: "", data: balance });
    } catch (error: any) {
      LoggerService.error(
        `[MaticController-getBalanceBEP20] err: ${error.toString()}`
      );
      res.status(500).send({});
    }
  },
};
