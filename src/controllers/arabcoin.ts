import { ArabCoinService } from "../services";

export const ArabCoinController = {
  getPrice: async (req: any, res: any) => {
    const arabCoinPrice = ArabCoinService.getPrice();
    return res.status(200).send({ code: 0, message: "", data: arabCoinPrice });
  },
};
