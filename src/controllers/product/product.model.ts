import mongoose from "mongoose";
import { MODEL_NAMES } from "../../models/models.config";

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.UUID,
      default: new mongoose.Types.UUID(),
    },
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
export const ProductModel = mongoose.model(MODEL_NAMES.PRODUCT, productSchema);
export type IProductModel = typeof ProductModel;
