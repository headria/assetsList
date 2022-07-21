import { LoggerService } from "../logger";
import * as refService from "../services/referralcodes";
import { ArabCoinService } from "../services/arabcoin";

export const ReferralController = {
  addNew: async (req: any, res: any) => {
    try {
      const result = await refService.generateNewReferral(req.body);
      return res.status(200).send({
        code: 0,
        message: "",
        data: result,
      });
    } catch (e: any) {
      LoggerService.error(e.toString());

      return res.status(500).send({});
    }
  },
  updatePercentage: async (req: any, res: any) => {
    try {
      const result = await refService.updatePercentage(req.body);
      return res.status(200).send({
        code: 0,
        message: "",
        data: result,
      });
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
  getReferralByAddress: async (req: any, res: any) => {
    try {
      const result = await refService.getReferralByAddress(req.query?.address);
      return res.status(200).send({
        code: 0,
        message: "",
        data: result,
      });
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
  getBalanceByAddress: async (req: any, res: any) => {
    try {
      if (!req.query?.address)
        return res
          .status(400)
          .send({ code: -1, message: "Address is required" });
      const result = await ArabCoinService.populateReferralBalance(
        req.query?.address
      );
      return res.status(200).send({
        code: 0,
        message: "",
        data: result,
      });
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
};
