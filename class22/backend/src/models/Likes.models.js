const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:[true, "Post is required to like "]
    },
    user:{
        type:String,
        required:[true, "user is required to like the post"]
    }
},{
    timestamps:true
})

likeSchema.index({post:1,user:1}, {unique:true})

const likeModel = mongoose.model("like", likeSchema)

module.exports = likeModel