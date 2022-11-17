import { LoggerService } from "../logger";
import AssetsModel, { AssetsDTO } from "../models/assets";

export const AssetsService = {
  getByContractAdderss: async (contractAddress: string) => {
    try {
      const token = await AssetsModel.findOne({
        id: contractAddress.toLowerCase(),
      });

      return token;
    } catch (e: any) {
      LoggerService.error(e.toString());
      return false;
    }
  },
};
