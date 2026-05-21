import mongoose from "mongoose";

async function ConnectDB() {
    try{
        await mongoose.connect(process.env.AUTH_MONGO_URI);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


export default ConnectDB;