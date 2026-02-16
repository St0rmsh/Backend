const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true, "Username is already taken"],
        required:[true, "Username is required"]
    },
    email:{
         type:String,
        unique:[true, "email is already registered"],
        required:[true, "email is required"]
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    bio:String,
    profileImg:{
        type:String,
        default:"https://ik.imagekit.io/p7b10nfhs/default.png?updatedAt=1770739987572"
    }
})


const userModel = mongoose.model("users",userSchema)


module.exports = userModel