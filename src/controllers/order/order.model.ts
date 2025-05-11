import mongoose from "mongoose";
import { MODEL_NAMES } from "../../models/models.config";

const orderProductSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      required: true,
      default: new mongoose.Types.UUID(),
    },
    productId: {
      type: mongoose.Schema.Types.UUID,
      ref: MODEL_NAMES.PRODUCT,
      required: true,
    },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
  },
  { timestamps: true }
);
const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default:()=> new mongoose.Types.UUID(),
    },

    customerId: {
      type: mongoose.Schema.Types.UUID,
      ref: MODEL_NAMES.CUSTOMER,
      required: true,
      default: new mongoose.Types.UUID(),
    },
    products: [orderProductSchema],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["canceled", "completed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ customerId: 1,orderDate:1 });
export const OrderModel = mongoose.model(MODEL_NAMES.ORDER, orderSchema);

export type IOrderModel = typeof OrderModel;
