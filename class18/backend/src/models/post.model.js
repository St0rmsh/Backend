const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    imgUrl:{
        type:String,
        required:[true, "Img is required for creating post"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "user is required for creating post"]
    }
})


const postModel = mongoose.model("posts", postSchema)


module.exports = postModel