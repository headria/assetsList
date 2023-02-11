import { Schema, model, Document } from "mongoose";
const collectionName = "referrals";
const Referral = new Schema(
  {
    referral_code: {
      type: String,
      unique: false,
      required: true,
    },
    referred_by_address: {
      type: String,
      required: true,
    },
    referred_to_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export interface ReferralDTO extends Document {
  referral_code: string;
  referred_by_address: string;
  referred_to_address: string;
}
export default model<ReferralDTO>(collectionName, Referral);
