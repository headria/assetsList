import { ArabCoinSummeryTransaction } from "./../interfaces/arabcoin";
import { ArabCoin } from "../interfaces/arabcoin";
import { ArabCoinService } from "../services";
import { LoggerService } from "../logger";

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

    if (!body?.amount_arb)
      return res.status(400).send({
        code: 400,
        message: "amount_arb is required",
      });
    if (!body?.amount_network)
      return res.status(400).send({
        code: 400,
        message: "amount_network is required",
      });

    if (!body?.from)
      return res.status(400).send({
        code: 400,
        message: "from is required",
      });
    if (!body?.to)
      return res.status(400).send({
        code: 400,
        message: "to is required",
      });

    if (!body?.network)
      return res.status(400).send({
        code: 400,
        message: "network is required",
      });

    const statusCheck = await ArabCoinService.addNewRequest(body);
    return res.status(200).send({ code: 0, message: "", data: statusCheck });
  },
  getTotalBalance: async (req: any, res: any) => {
    const statusCheck = await ArabCoinService.getTotalArabCoin();
    return res.status(200).send({
      code: 0,
      message: "",
      data: {
        statusCheck,
        total35Usdt: Number(statusCheck.price35) * 0.035,
        total05Usdt: Number(statusCheck.price05) * 0.05,
        total07Usdt: Number(statusCheck.price07) * 0.07,
      },
    });
  },
  getTotalBalancePerAccount: async (req: any, res: any) => {
    const address: string = req.query?.address;
    console.log(address);
    const statusCheck = await ArabCoinService.getBalancePerAddress(
      address?.split(",") || ""
    );
    return res.status(200).send({
      code: 0,
      message: "",
      data: {
        balance: statusCheck,
        price: 0.07,
      },
    });
  },
  getTransactions: async (req: any, res: any) => {
    const address: string = req.query?.address;

    const statusCheck = await ArabCoinService.getTransactionsByAddress(
      address?.split(",") || ""
    );
    return res.status(200).send({
      code: 0,
      message: "",
      data: statusCheck,
    });
  },
  getSuccessTransactions: async (req: any, res: any) => {
    try {
      const listtrxs = await ArabCoinService.getArabCoinSuccessTransactions();

      return res.status(200).send({
        code: 0,
        message: "",
        data: listtrxs,
      });
    } catch (e: any) {
      LoggerService.error("[getSuccessTransactions] err:" + e.toString());
    }
  },
};
