import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:[true, "Chat is required"]
    },
    content:{
        type:String,
        required:[true, "Content is required"]
    },
    role:{
        type:String,
        enum:["user", "assistant"],
        required:[true, "Role is required"]
    }
},{timestamps:true})

export const MessageModel = mongoose.model("Message", messageSchema)
