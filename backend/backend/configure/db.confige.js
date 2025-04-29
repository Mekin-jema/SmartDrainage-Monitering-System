import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log("Mongodb connected successfully")
    return conn;
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default db;
