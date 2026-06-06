import UserModel from "../model/auth.model.js";
import type { RegisterBody } from "../types/Auth/user.types.js";
import jwt from "jsonwebtoken"
import config from "../config/config.js"



export const registerUserService = async (data:RegisterBody) =>{

    try {
        
        const {fullname,email,password,username} = data

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }]});

        if(existingUser){
            throw new Error("User already exists")
        }

        const newUser = await UserModel.create({
            fullname,
            email,
            password,
            username,
        })

        //Token Generation Function here
        const accessToken = jwt.sign({_id: newUser._id},config.ACCESS_TOKEN,{ expiresIn: "15m" })

        const refreshToken = jwt.sign({_id: newUser._id},config.REFRESH_TOKEN,{ expiresIn: "7d" })

        return {
            user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        isVerified: newUser.isVerified
    },
            accessToken,
            refreshToken

        }
    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}
