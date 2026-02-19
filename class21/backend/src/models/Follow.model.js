const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "Follower is required to follow"]
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "Following is required to follow"]
    }
},{
    timestamps:true
})


const followModel = mongoose.model("follow", followSchema)


module.exports= followModel