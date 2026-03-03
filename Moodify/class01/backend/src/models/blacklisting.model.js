const mongoose = require("mongoose")



const blacklistingSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "token is required "]
    }
},{
    timestamps:true
})


const blacklistingModel = mongoose.model("blacklisting",blacklistingSchema)

module.exports = blacklistingModel