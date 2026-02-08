const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        uinque:true
    },
    password:{
        type:String
    }
})



const UserSchema = mongoose.model("users", userSchema)


module.exports = UserSchema