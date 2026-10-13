import "dotenv/config";

import mongoose from "mongoose";

// console.log("MongoDB URI:", process.env.MONGODB_URI);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;
