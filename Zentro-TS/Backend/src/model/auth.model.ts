import mongoose from "mongoose";
import {Document, Schema, Model} from "mongoose"
import bcrypt from "bcrypt"

export type  User = {
    username: string;
    fullname: string;
    email: string;
    password: string;
    avatar?: string;
    banner?: string;
    isVerified?: boolean;
    bio?: string;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    postCount: number;
    isActive?: boolean;
    refreshToken?: string;
    role: "admin" | "user";
}


export type UserMethods = {
    comparePassword: (password: string) => Promise<boolean>
}

export type UserDocument =  User & Document & UserMethods & {
    createdAt: Date;
    updatedAt: Date;
}


const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        trim: true
    },
    banner:{
        type:String,
        default: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop",
    },
    bio:{
        type:String,
        default: "",
    },
    isVerified:{
        type:Boolean,
        default: false,
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    postCount:{
        type:Number,
        default: 0,
    },
    isActive:{
        type:Boolean,
        default: true,
    },
    refreshToken:{
        type:String,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "user", "author"],
        default: "user"
    }
},{
    timestamps: true
})


userSchema.pre("save", async function(this: UserDocument): Promise<void> {
    if (!this.isModified("password")) return;
    const SALT_ROUNDS = 10
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(this: UserDocument,password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User", userSchema)

export default UserModel