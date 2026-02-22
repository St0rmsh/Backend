const mongoose = require("mongoose")

const unlikeSchema = new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:[true, "post is required to dislike post"]
    },
    user:{
        type:String,
        ref:"users",
        required:[true, "user is required to dislike the post"]
    }
},{
    timestamps:true
})

unlikeSchema.index({post:1,user:1},{unique:true})

const unlikeModel = mongoose.model("dislikes",unlikeSchema)


module.exports = unlikeModel