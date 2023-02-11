import moment from "moment";
import { ReferralResponse } from "../interfaces/referral";
import Referral, { ReferralDTO } from "../models/referral";
import { cacheData, getCachedData } from "../utils/cacheRequest";
import { checkExitsReferralCodeByCode } from "./referralcodes";

export class ReferralService {
  async createReferral(
    referredByAddress: string,
    referredToAddress: string,
    referralCode: string
  ): Promise<ReferralResponse> {
    try {
      const referralExists = await checkExitsReferralCodeByCode(referralCode);
      if (!referralExists) throw new Error("Referral code does not exist");

      const referral = new Referral({
        referral_code: referralCode,
        referred_by_address: referredByAddress,
        referred_to_address: referredToAddress,
      });
      await referral.save();
      return referral;
    } catch (error) {
      throw new Error(`Error creating referral: ${error}`);
    }
  }

  async getReferrals(): Promise<ReferralResponse[]> {
    try {
      return await Referral.find({});
    } catch (error) {
      throw new Error(`Error retrieving referrals: ${error}`);
    }
  }

  async getReferralByCode(referralCode: string): Promise<ReferralResponse> {
    try {
      const data = await Referral.findOne({ referral_code: referralCode });
      return {
        referral_code: data?.referral_code,
        referred_by_address: data?.referred_by_address,
        referred_to_address: data?.referred_to_address,
      };
    } catch (error) {
      throw new Error(`Error retrieving referral by code: ${error}`);
    }
  }
  async getDailyLeaderboard(): Promise<Array<{ _id: string; count: number }>> {
    try {
      const cachedData = await getCachedData("daily-leaderboard");
      if (cachedData.cached) return cachedData.payload;

      const result = await Referral.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
            },
          },
        },
        {
          $group: {
            _id: "$referred_by_address",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]).exec();

      cacheData("daily-leaderboard", JSON.stringify(result), 300);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getWeeklyLeaderboard(): Promise<Array<{ _id: string; count: number }>> {
    try {
      const cachedData = await getCachedData("weekly-leaderboard");
      if (cachedData.cached) return cachedData.payload;

      // Get the current number of the week in the year
      const currentWeek = moment().week();

      const startOfThisWeek = moment()
        .week(currentWeek)
        .startOf("week")
        .toDate();

      const endOfThisWeek = moment().week(currentWeek).endOf("week").toDate();

      const result = await Referral.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfThisWeek, $lt: endOfThisWeek },
          },
        },
        {
          $group: {
            _id: "$referred_by_address",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]).exec();

      cacheData("weekly-leaderboard", JSON.stringify(result), 3600);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyLeaderboard(): Promise<
    Array<{ _id: string; count: number }>
  > {
    try {
      const cachedData = await getCachedData("monthly-leaderboard");
      if (cachedData.cached) return cachedData.payload;

      const startOfThisMonth = new Date();
      startOfThisMonth.setDate(1);
      startOfThisMonth.setHours(0, 0, 0, 0);

      const endOfThisMonth = new Date();
      endOfThisMonth.setMonth(endOfThisMonth.getMonth() + 1);
      endOfThisMonth.setDate(0);
      endOfThisMonth.setHours(23, 59, 59, 999);
      const result = await Referral.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfThisMonth, $lt: endOfThisMonth },
          },
        },
        {
          $group: {
            _id: "$referred_by_address",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]).exec();

      cacheData("monthly-leaderboard", JSON.stringify(result), 3600);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
