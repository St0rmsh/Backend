const mongoose = require("mongoose")

const dislikeSchema = new mongoose.Schema({
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

dislikeSchema.index({post:1,user:1}, {unique:true})

const disikeModel = mongoose.model("dislike", dislikeSchema)

module.exports = disikeModel