const mongoose = require("mongoose")



const CommentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "User is required to comment on post"]
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:[true, "Post is required to comment"]
    }
},{
    timestamps:true
})


const CommentModel = mongoose.model("comment", CommentSchema)

module.exports = CommentModel