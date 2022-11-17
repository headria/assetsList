import { LoggerService } from "../logger";
import AssetsModel, { AssetsDTO } from "../models/assets";

export const AssetsService = {
  getByContractAdderss: async (contractAddress: string) => {
    try {
      (await AssetsModel.find({})).map(async (x, i) => {
        x.id = x.id.toLowerCase();
        console.log({ id: x.id, r: i });
        await x.save();
      });
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
