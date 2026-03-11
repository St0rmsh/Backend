import mongoose from "mongoose";


async function ConnectDB() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB Connected successfully");
    
}

export default ConnectDB