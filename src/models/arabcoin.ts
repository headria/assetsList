import { Schema, model, Document } from "mongoose";

const collectionName = "arabcoin";
export interface ArabCoinDTO extends Document {
  from: string;
  to: string;
  network: string;
  balance_network: string;
  balance_arb: number;
  hash: string;
  status: string;
}

const arabCoin = new Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    network: {
      type: String,
      trim: true,
      index: true,
    },
    balance_network: {
      type: String,
      trim: true,
    },
    balance_arb: {
      type: Number,
      trim: true,
    },

    hash: {
      type: String,
      required: true,
      trim: true,
    },
    // Rejected, Success, New
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<ArabCoinDTO>(collectionName, arabCoin);
