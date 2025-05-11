import mongoose from "mongoose";
import { DB_PATH } from "../constants/constants";

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_PATH);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
