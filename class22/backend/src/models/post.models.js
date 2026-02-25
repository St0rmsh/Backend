const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUrl:{
        type:String,
        required:[true, "image is required to create post"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "User is required to create post"]
    }
},{
    timestamps:true
})


const postModel = mongoose.model("posts", postSchema)

module.exports = postModel