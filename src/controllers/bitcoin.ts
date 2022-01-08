import { LoggerService } from "../logger";
import { bitcoinServices } from "../services/bitcoin";

export const BitcoinController = {
  getBalance: async (req: any, res: any) => {
    try {
      const address = req.query?.address;
      const balanceData = await bitcoinServices.getBalance(address);
      res.status(200).send({ code: 0, message: "", data: balanceData });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getTrxLists: async (req: any, res: any) => {
    try {
      const address = req.query?.address;
      const trxLists = await bitcoinServices.getTransactionsList(address);
      res.status(200).send({ code: 0, message: "", data: trxLists });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
  getUTXOs: async (req: any, res: any) => {
    try {
      const address = req.query?.address;
      const balanceData = await bitcoinServices.getUTXOs(address);
      res.status(200).send({ code: 0, message: "", data: balanceData });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
};
