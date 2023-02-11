import { Request, Response } from "express";
import { ReferralService } from "./../services/referral";
export class ReferralController {
  referralService = new ReferralService();

  async createReferral(req: Request, res: Response): Promise<Response> {
    const referral = req.body;
    try {
      const createdReferral = await this.referralService.createReferral(
        referral
      );
      return res.status(201).json({
        message: "Referral created successfully",
        referral: createdReferral,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create referral",
        error: error.message,
      });
    }
  }

  async getReferrals(req: Request, res: Response): Promise<Response> {
    try {
      const referrals = await this.referralService.getReferrals();
      return res.status(200).json({
        message: "Referrals retrieved successfully",
        referrals: referrals,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve referrals",
        error: error.message,
      });
    }
  }

  // Similar implementations for other methods
}
