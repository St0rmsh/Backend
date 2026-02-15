const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username is required"],
        unique:[true , "username is already taken"]
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:[true , "email is already registered"]

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


const userModel = mongoose.model("users", userSchema)

module.exports = userModel