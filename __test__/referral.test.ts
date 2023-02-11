import mongooseConnection from "../src/database";
import mongoose from "mongoose";
import { ReferralService } from "../src/services/referral";
import { disconnectRedis } from "../src/thirdparty/redis";

let connection: mongoose.Connection | null = null;

beforeAll(async () => {
  mongooseConnection((err, conn) => {
    if (err) {
      console.log(err);
      connection = null;
    } else {
      connection = conn;
    }
  });
});
afterAll(async () => {
  await disconnectRedis();

  await connection?.close();
});
describe("Referral Service", () => {
  it("should create a referral", async () => {
    const referralService = new ReferralService();
    const referral = await referralService.createReferral(
      "0x123",
      "0x456",
      "164"
    );
    expect(referral).toHaveProperty("referral_code");
    expect(referral).toHaveProperty("referred_by_address");
    expect(referral).toHaveProperty("referred_to_address");
    expect(referral).toHaveProperty("createdAt");
    expect(referral).toHaveProperty("updatedAt");
  });
  it("should get referrals", async () => {
    const referralService = new ReferralService();
    const referrals = await referralService.getReferrals();
    expect(referrals).toHaveLength(4);
  });
  it("should get referral by code", async () => {
    const referralService = new ReferralService();
    const referral = await referralService.getReferralByCode("164");
    expect(referral).toHaveProperty("referral_code");
    expect(referral).toHaveProperty("referred_by_address");
    expect(referral).toHaveProperty("referred_to_address");
  });
  it("should get daily leaderboard", async () => {
    const referralService = new ReferralService();
    const leaderboard = await referralService.getDailyLeaderboard();
    expect(leaderboard).toHaveLength(1);
  });
  it("should get weekly leaderboard", async () => {
    const referralService = new ReferralService();
    const leaderboard = await referralService.getWeeklyLeaderboard();
    expect(leaderboard).toHaveLength(1);
  });
  it("should get monthly leaderboard", async () => {
    const referralService = new ReferralService();
    const leaderboard = await referralService.getMonthlyLeaderboard();
    expect(leaderboard).toHaveLength(1);
  });
});
