import { Schema, model, Document } from "mongoose";

const collectionName = "referralcodes";
export interface ReferralCodesDTO extends Document {
  referral_code: string;
  user_wallet_addresseses: [string];
  percentage: number;
}

const refcodes = new Schema(
  {
    referral_code: {
      type: String,
      unique: true,
      required: true,
    },
    user_wallet_addresseses: {
      type: [String],
    },

    percentage: {
      type: Number,
      default: 10,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ReferralCodesDTO>(collectionName, refcodes);
