const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        required:[true, "Caption is required"],
        default:""
    },
    imgUrl:{
        type:String,
        required:[true, "Image is required"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required:[true, "user id is required for creating post"]
    }
})


const PostModel = mongoose.model("posts", postSchema)

module.exports = PostModel