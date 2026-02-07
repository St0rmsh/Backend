const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
})

const usersModel = mongoose.model("users", userSchema)


module.exports = usersModel