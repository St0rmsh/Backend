import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redis from "../config/cache.js";
import { success } from "zod";


export async function registerController(req, res) {
    try {
        const { name, username, email, password } = req.body;

        console.log("Checking user:", { email, username });


        const isAlreadyExists = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        console.log("Found user:", isAlreadyExists);


        if (isAlreadyExists) {
            return res.status(409).json({
                message: "User is Already registered",
                success: false,
                err: "User Already Exists"
            });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password
        });

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered Successfully",
            success: true,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
                subscribersCount: user.subscribersCount,
                subscribingCount: user.subscribingCount,
                videosCount: user.videosCount,
                totalViews: user.totalViews,
                isSuspended: user.isSuspended,
                suspendReason: user.suspendReason,
                subscribersPreview: user.subscribersPreview,
                provider: user.provider,
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            err: error.message
        });
    }
}

export async function loginController(req,res){

    try {
        
        const {username,email,password} = req.body

        const user = await userModel.findOne({
            $or:[
                {email},
                {username}
            ]
        })
        if (!email && !username) {
    return res.status(400).json({
        message: "Email or Username required"
    })
}

if (!password) {
    return res.status(400).json({
        message: "Password required"
    })
}


        if (!user) {
            return res.status(404).json({
                message:"User not found",
                success:false,
                err:"user not found"
            })
        }

        const isMatched = await user.comparePassword(password)

        if (!isMatched) {
            return res.status(401).json({
                message:"Invalid credentials",
                success:false,
                err:"Invalid credentials"
            })
        }
        const token = jwt.sign({
            id:user._id
        },config.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json({
            message:"User loggedIn Successfully",
            success:true,
            user:{
                name:user.name,
                username:user.username,
                email:user.email,
                avatar:user.avatar,
                isVerified:user.isVerified,
                subscribersCount:user.subscribersCount,
                subscribingCount:user.subscribingCount,
                videosCount:user.videosCount,
                totalViews:user.totalViews,
                isSuspended:user.isSuspended,
                suspendReason:user.suspendReason,
                subscribersPreview:user.subscribersPreview,
                provider:user.provider,
            }
        })

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,
            err:error.message
        })
    }
}


export async function getMeController(req,res) {

    try {

        const userId = req.user.id

        if (!userId) {
            return res.status(401).json({
                message:"Unauthorized",
                success:false,
                err:"Unauthorized"
            })
        }

        const user = await userModel.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({
                message:"User not Found",
                success:false,
                err:"User not found"
            })
        }

        return res.status(200).json({
            message:"User fetched Successfully",
            success:true,
            user
        })

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,
            err:error.message
        })
    }
}



export async function logoutController(req,res) {

    try {
        
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message:"Token not Found",
                success:false,
                err:"Token not Found"
            })
        }

        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:0
        })

        await redis.set(token,Date.now().toString(),"EX",60*60)

        return res.status(200).json({
            message:"User loggedOut Successfully",
            success:true,
        })

    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({
            message:"Internal Server Error",
            success:false,
            err:error.message
        })
    }
}