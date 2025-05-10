import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const db = async () => {
  try { 
<<<<<<< HEAD
    console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI);
=======

    const conn = await mongoose.connect(process.env.MONGODB_URI);
>>>>>>> 8f3afb9e86f43aa374a34cca162284f314165235
  console.log("Mongodb connected successfully")
    return conn;
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default db;
