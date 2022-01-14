import { LoggerService } from "../logger";
import { EtherService, SmartchainService } from "../services";
export const SmartchainController = {
  getAllTx: async (req: any, res: any) => {
    try {
      const query = req.query;

      const txList = await SmartchainService.accounts.getListTransactions(
        query?.address,
        query?.startblock,
        query?.endblock,
        query?.page,
        query?.offest || 100,
        query?.sort,
        query?.chain
      );

      if (query?.contractAddress) {
        txList.filter((x: any) => x.contractAddress === query.contractAddress);
      } else {
        txList.filter((x: any) => x.contractAddress === "");
      }
      res.status(200).send({ code: 0, message: "", data: txList });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getBalanceBEP20: async (req: any, res: any) => {
    try {
      const query = req.query;

      const balance = await SmartchainService.contracts.getBalanceBEP20(
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
