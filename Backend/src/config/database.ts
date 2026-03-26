// Database connection configuration

import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/courtsync";

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✓ Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("✗ MongoDB connection error:", error);
    throw error; // Let caller decide how to handle
  }
};

export default connectDB;
