import { ArabCoin } from "../interfaces/arabcoin";
import { ArabCoinService } from "../services";

export const ArabCoinController = {
  getPrice: async (req: any, res: any) => {
    const symbol: string = req.query?.symbol;

    const arabCoinPrice = await ArabCoinService.getPrice(symbol);
    return res.status(200).send({ code: 0, message: "", data: arabCoinPrice });
  },
  checkAmount: async (req: any, res: any) => {
    const amount: number = req.query?.amount;
    const statusCheck = await ArabCoinService.checkAmount(amount);
    return res.status(200).send({ code: 0, message: "", data: statusCheck });
  },
  newRequest: async (req: any, res: any) => {
    const body: ArabCoin = req.body;

    if (!body?.hash)
      return res.status(400).send({
        code: 400,
        message: "Hash is required",
      });

    const statusCheck = await ArabCoinService.addNewRequest(body);
    return res.status(200).send({ code: 0, message: "", data: statusCheck });
  },
  getTotalBalance: async (req: any, res: any) => {
    const statusCheck = await ArabCoinService.getTotalArabCoin();
    return res.status(200).send({ code: 0, message: "", data: statusCheck });
  },
  getTotalBalancePerAccount: async (req: any, res: any) => {
    const address: string = req.query?.address;

    const statusCheck = await ArabCoinService.getBalancePerAddress(
      address?.split(",") || ""
    );
    return res.status(200).send({ code: 0, message: "", data: statusCheck });
  },
};
