import { Schema, model, Document } from "mongoose";

export interface AssetsDTO extends Document {
  name: string;
  website: string;
  description: string;
  explorer: string;
  research: string;
  symbol: string;
  type: string;
  decimals: Number;
  status: string;
  tags: [string];
  links: { name: string; url: string }[];
  id: string;
  logoPath: string;
}

const assetModel = new Schema(
  {
    name: String,
    website: String,
    description: String,
    explorer: String,
    research: { type: String, required: false },
    symbol: String,
    type: String,
    decimals: Number,
    status: String,
    tags: [String],
    links: [{ name: String, url: String }],
    id: String,
    logoPath: String,
  },
  {
    timestamps: true,
  }
);

export default model("assets", assetModel);
