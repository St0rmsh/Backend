import mongoose from "mongoose";
import config from "./config.js";



const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;