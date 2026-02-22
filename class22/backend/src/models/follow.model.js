const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower:{
        type:String,
        required:[true, "follower is required to follow "]
    },
    followee:{
        type:String,
        required:[true, "followe is required to follow"]
    },
    status:{
        type:String,
        default:"pending",
        enum:{
            values:["pending","accept","reject"],
        }
    }
}, {
    timestamps:true
})

followSchema.index({follower:1, followee:1}, {unique:true})

const followModel = mongoose.model("follow", followSchema)

module.exports = followModel