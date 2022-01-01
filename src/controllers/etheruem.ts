import { LoggerService } from "../logger";
import { EtherService } from "../services";
export const EthereumController = {
  getAllTx: async (req: any, res: any) => {
    try {
      const query = req.query;

      const txList = await EtherService.accounts.getListTransactions(
        query?.address,
        query?.startblock,
        query?.endblock,
        query?.page,
        query?.offest,
        query?.sort,
        query?.chain
      );

      res.status(200).send({ code: 0, message: "", data: txList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
};
