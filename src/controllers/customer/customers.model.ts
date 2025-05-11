import mongoose from "mongoose";
import { MODEL_NAMES } from "../../models/models.config";

const customerSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: new mongoose.Types.UUID(),
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    location: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model(
  MODEL_NAMES.CUSTOMER,
  customerSchema
);

export type ICustomerModel = typeof CustomerModel;
