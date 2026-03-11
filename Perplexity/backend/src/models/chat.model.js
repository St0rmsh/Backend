import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "User is required"]
    },
    title:{
        type:String,
        required:[true, "Title is required"]
    }
},{
    timestamps:true
})

export const Chat = mongoose.model("Chat", chatSchema)
