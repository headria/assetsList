import { LoggerService } from "../logger";
import { balance } from "../services/bitcoin";

export const BitcoinController = {
  getBalance: async (req: any, res: any) => {
    try {
      const address = req.query?.address;
      const balanceData = await balance.getBalance(address);
      res.status(200).send({ code: 0, message: "", data: balanceData });
    } catch (error) {
      LoggerService.error(error);
      res.status(500).send({});
    }
  },
};
