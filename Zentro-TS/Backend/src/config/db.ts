import mongoose from "mongoose"
import config from "./config.js"


async function ConnectDB() {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("MongoDB connectioon Error");
        throw new Error(`MongoDB connectioon Error ${error}`);
        process.exit(1)
    }
}

export default ConnectDB