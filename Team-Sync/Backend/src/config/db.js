import mongoose from "mongoose"
import { Config } from "./config.js"

const ConnectDB = async()=>{

    await mongoose.connect(Config.MONGO_URI)
    console.log("Connected to mongoDB");

}


export default ConnectDB