import mongoose from "mongoose";
import { envConfig } from "./env-config";

export const connectToDatabase = async () => {
  try {
    const mongoUrl = envConfig.DATABASE_URL;
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
