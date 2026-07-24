import mongoose from "mongoose";

async function ConnectDB() {
    try{
        await mongoose.connect(process.env.AUTH);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
}


export default ConnectDB;