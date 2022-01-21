import { LoggerService } from "../logger";
import { EtherService } from "../services";
export const EthereumController = {
  getAllTx: async (req: any, res: any) => {
    try {
      const query = req.query;

      let txList = [];

      txList = await EtherService.accounts.getListTransactions(
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
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },

  getBalanceERC20: async (req: any, res: any) => {
    try {
      const query = req.query;

      const balance = await EtherService.contracts.getBalanceERC20(
        query?.contractAddress,
        query?.walletAddress
      );

      res.status(200).send({ code: 0, message: "", data: balance });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
};
