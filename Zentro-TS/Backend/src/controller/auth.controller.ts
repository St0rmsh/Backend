import { type Request, type Response } from "express";
import UserModel, { type UserDocument } from "../model/auth.model.js";
import {config} from "../config/config.js";
import jwt from "jsonwebtoken" 




type AuthResponse = {
  success: boolean
  message: string
  user: {
    _id: string
    username: string
    email: string
    fullName: string
    avatar?: string
    banner?: string
    bio?: string
    isVerified?: boolean
    followers: string[]
    following: string[]
    postCount: number
    isActive?: boolean
    role: "admin" | "user" | "author"
  }
}

const sendResponseToken = (user: UserDocument,statusCode: number,res: Response<AuthResponse>,message: string): void => {
       const token = jwt.sign(
       { id: user._id.toString() },
         config.JWT_SECRET,
        { expiresIn: "15m" }
       )

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000
  })

  res.status(statusCode).json({
    success: true,
    message,
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      isVerified: user.isVerified,
      followers: user.followers?.map(id => id.toString()) ?? [],
      following: user.following?.map(id => id.toString()) ?? [],
      postCount: user.postCount,
      isActive: user.isActive,
      role: user.role
    }
  })
}


type RegisterBody = {
    username: string;
    email: string;
    password: string;
    fullname: string;
}

export const registerController = async (req: Request<{},{},RegisterBody>,res: Response): Promise<void> => {
    try {
        
        const {username,email,password,fullname} = req.body

        if(!username.trim() || !email.trim() || !password.trim() || !fullname.trim()){
            throw new Error("All fields are required")
        }

        const userExists = await UserModel.findOne({
            $or:[
                {username: username.toLowerCase()},
                {email: email.toLowerCase()}
            ]
        })
        if(userExists){
            throw new Error("User already exists")
        }

        const newUser = await UserModel.create({
            username,
            email,
            password,
            fullname
        })

         return sendResponseToken(newUser,201,res,"User registered successfully")

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}