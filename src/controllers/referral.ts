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
      const percentage = req.body?.percentage;
      if (!percentage)
        return res.status(400).send({
          code: -1,
          message: "percentage is required.",
        });
      if (!req.body?.referral_code)
        return res.status(400).send({
          code: -1,
          message: "referral_code is required.",
        });

      if (percentage > 10 || percentage < 0)
        return res.status(400).send({
          code: -1,
          message: "percentage must be between 0 to 10.",
        });
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
  checkRefCode: async (req: any, res: any) => {
    try {
      if (!req.query?.referralcode)
        return res
          .status(400)
          .send({ code: -1, message: "Referral code is required" });
      const result = await refService.checkExitsReferralCodeByCode(
        req.query?.referralcode
      );
      return res.status(200).send({
        code: 0,
        message: "",
        data: {
          referral_code: result?.referral_code,
          percentage: result?.percentage,

          // discount = 10 + 5 - ref.percentage
          discount: 15 - parseInt(result?.percentage?.toString() || "0"),
        },
      });
    } catch (e: any) {
      LoggerService.error(e.toString());
      return res.status(500).send({});
    }
  },
  newClaim: async (req: any, res: any) => {
    const query = req.query;
    if (!query.address)
      return res.status(400).send({
        code: -1,
        message: "Address is required",
      });

    return res.status(200).send({
      code: 0,
      message: "",
      data: true,
    });
  },
  getLastStatusClaim: async (req: any, res: any) => {
    const query = req.query;
    if (!query.address)
      return res.status(400).send({
        code: -1,
        message: "Address is required",
      });

    return res.status(200).send({
      code: 0,
      message: "",
      data: {
        nextPayment: 1658583836,
        locked: true,
      },
    });
  },
};
