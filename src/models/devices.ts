import { Schema, model, Document } from "mongoose";

const collectionName = "devices";
export interface DeviceDTO extends Document {
  dID: string;
  token: string;
  type: string;
}

const devices = new Schema({
  dID: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  token: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default model<DeviceDTO>(collectionName, devices);
