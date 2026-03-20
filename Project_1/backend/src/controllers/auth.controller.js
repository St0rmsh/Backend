import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function registerController(req, res) {
    try {
        const { name, username, email, password } = req.body;

        const isAlreadyExists = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

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
