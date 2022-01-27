import { Schema, model, Document } from "mongoose";

const collectionName = "addresses";
export interface AddressesDTO extends Document {
  dID: string;
  addresses: string[];
  blockchain: string;
}

const addresses = new Schema({
  dID: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  blockchain: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  addresses: {
    type: [String],
    required: true,
  },
});

export default model<AddressesDTO>(collectionName, addresses);
