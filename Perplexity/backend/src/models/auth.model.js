import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        unique:[true, "Username is already taken"]
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:[true, "email is already registered"]
    },
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

userSchema.pre("save", async function(){
   
    try{
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }catch(error){
        console.error("eror "+ error);
        
    }
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export const UserModel = mongoose.model("User", userSchema)