import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:[true, "username is required"],
        unique:[true, "username is already taken"],
        trim:true

    },
    name:{
        type:String
    },
    email:{
        type:String,
        required:[true, "email is required"],
        unique:[true, "email is alreay registered"],
        trim:true
    },
    password:{
        type:String,
        required:[true, "password is required"],
    },
    avatar:{
        type:String,
        default:"https://ik.imagekit.io/p7b10nfhs/default.png?updatedAt=1770739987572",


    },
    isVerified:{
        type:Boolean,
        default:false
    },
    bio:{
        type:String,
        trim:true
    },
    banner:{
        type:String,
        default:"https://ik.imagekit.io/p7b10nfhs/banner%20default.avif"
    },
    subscribersCount:{
        type:Number,
        default:0
    },
    subscribingCount:{
        type:Number,
        default:0
    },
    videosCount:{
        type:Number,
        default:0
    },
    totalViews:{
        type:Number,
        default:0
    },
    isSuspended:{
        type:Boolean,
        default:false
    },
    suspendReason:{
        type:String,
        default:""
    },

    subscribersPreview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    provider:{
        type:String,
        enum:["local", "google"]
    }



},{
    timestamps:true
})

userSchema.pre("save",async function(){

    if (!this.isModified("password")) {
        return 
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("User", userSchema)

export default userModel