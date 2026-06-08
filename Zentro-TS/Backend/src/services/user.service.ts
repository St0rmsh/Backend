import UserModel from "../model/auth.model.js";
import type { LoginBody, RegisterBody, UpdateUserBody } from "../types/Auth/user.types.js";
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import type { JwtPayload } from "../types/Jwt/payload.types.js";
import redisClient from "../config/cache.js";
import otpGenerate from "../utils/otp.js";
import otpModel from "../model/otp.model.js";
import sendEmail from "./email.service.js";



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

        const accessToken = jwt.sign({_id: newUser._id , email:newUser.email,roles:newUser.roles},config.ACCESS_TOKEN,{ expiresIn: "15m" })

        const refreshToken = jwt.sign({_id: newUser._id , email:newUser.email,roles:newUser.roles},config.REFRESH_TOKEN,{ expiresIn: "7d" })

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


export const loginUserService = async (data:LoginBody) =>{
    try {

        const {email,password,username} = data

        if(!email && !username || !password){
            throw new Error("Email or username or password is required")
        }

        const user = await UserModel.findOne({email});

        if(!user){
            throw new Error("User not found")
        }

        const isPasswordValid = await user.comparePassword(password)

        if(!isPasswordValid){
            throw new Error("Invalid Password")
        }

        user.lastLogin = new Date()

        await user.save()

        const accessToken = jwt.sign({_id: user._id , email:user.email,roles:user.roles},config.ACCESS_TOKEN,{ expiresIn: "15m" })
        const refreshToken = jwt.sign({_id: user._id , email:user.email,roles:user.roles},config.REFRESH_TOKEN,{ expiresIn: "7d" })

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                isVerified: user.isVerified
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


export const getMyProfileService = async (id:string) =>{
    try {
        
        if(!id){
            throw new Error("User not found")
        }

        const user = await UserModel.findById(id)
        
        if(!user){
            throw new Error("User not found")
        }

        return {
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                isVerified: user.isVerified
            }
        }
        
    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const genearteAccessTokenService = async (refreshToken:string) => {
    try {

        const decodedToken = jwt.verify(refreshToken,config.REFRESH_TOKEN)as JwtPayload;

        const user = await UserModel.findById(decodedToken._id)
        
        if(!user){
            throw new Error("User not found")
        }

        const accessToken = jwt.sign({
            _id: user._id,
            email: user.email,
            roles: user.roles

        },config.ACCESS_TOKEN,
        { expiresIn: "15m" })
        
        return accessToken
        
    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const logoutService = async (refreshToken:string, accessToken:string) => {
    try {

         jwt.verify(refreshToken,config.REFRESH_TOKEN)as JwtPayload;
         jwt.verify(accessToken,config.ACCESS_TOKEN)as JwtPayload;

       await redisClient.set(
        `logout:${accessToken}`,
        `true`,
        `EX`,
        60*15
       
       )

       await redisClient.set(
        `logout:${refreshToken}`,
        `true`,
        `EX`,
        60*60*24*7
        
       )

        return{
            success:true,
            message:"User logged out successfully"
        }
        
    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const updateUserDetailsSerivice = async (id:string,data:UpdateUserBody) =>{
    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(id,data,{new:true,runValidators: true
})
        
        if(!updatedUser){
            throw new Error("User not found")
        }

        return {
            _id: updatedUser._id,
            username: updatedUser.username,
            fullname: updatedUser.fullname,
            bio: updatedUser?.bio,
            avatar: updatedUser?.avatar,
            banner: updatedUser?.banner,
        }

    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}


export const sendOtpService = async (email:string)=>{
    
    try {

        const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("Email already verified");
    }

    const otp = otpGenerate();

    await otpModel.findOneAndUpdate(
        { email },
        {
            email,
            otp,
            expiresAt: new Date(
                Date.now() + 1 * 60 * 1000 
            ), 
            attempts: 0
        },
        {
            upsert: true,
            new: true
        }
    );

    await sendEmail({
        email,
        subject: "Email Verification",
        text: `Your OTP is ${otp}`,
        html: `<h2>Your OTP is ${otp}</h2>`
    });

    return {
        success: true,
        message: "OTP sent successfully"
    };

      


    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}




export const verifyOtpService = async (
    email: string,
    otp: string
) => {

    const otpDoc = await otpModel.findOne({
        email
    });

    if (!otpDoc) {
        throw new Error("OTP expired");
    }

    if (otpDoc.otp !== otp) {

        otpDoc.attempts += 1;

        await otpDoc.save();

        throw new Error("Invalid OTP");
    }

    const user = await UserModel.findOne({
        email
    });

    if (!user) {
        throw new Error("User not found");
    }

    user.isVerified = true;

    await user.save();

    await otpModel.deleteOne({
        email
    });

    return {
        success: true,
        message: "Email verified successfully"
    };
};