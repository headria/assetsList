import { LoggerService } from "../logger";
import { AssetsService } from "./../services/assets";
export const AssetsController = {
  getTokenByContractAddress: async (req: any, res: any) => {
    try {
      const address = req.query?.address;
      const getToken = await AssetsService.getByContractAdderss(address);
      return res.status(200).send({ code: 0, data: getToken });
    } catch (e) {
      LoggerService.error(`[getTokenByContractAddress]: ${e}`);
      return res.status(500).send({ code: -1, data: {} });
    }
  },
};
