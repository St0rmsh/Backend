import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redis from "../config/cache.js";
import otpModel from "../models/otp.model.js";

export async function registerController(req, res) {
    try {
        const { name, username, password } = req.body;
        const email = req.body.email?.toLowerCase().trim();

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        if (!username) {
            return res.status(400).json({
                message: "Username required"
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password required"
            });
        }

        const otpRecord = await otpModel.findOne({ email });

        if (
            !otpRecord ||
            !otpRecord.isVerified ||
            otpRecord.expiresAt < new Date()
        ) {
            return res.status(400).json({
                message: "OTP not verified or expired",
                success: false
            });
        }

        const exists = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (exists) {
            return res.status(409).json({
                message: "User already exists",
                success: false
            });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password,
            isVerified: true
        });

        await otpModel.deleteOne({ email });

        const token = jwt.sign(
            { id: user._id },
            config.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}



export async function loginController(req,res){

    try {
        
        const {username,password} = req.body

        const email = req.body.email?.toLowerCase().trim();

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

        if (user.isSuspended) {
    return res.status(403).json({
        message: "Account suspended",
        success: false
    });
}

        if (!user.isVerified) {
    return res.status(403).json({
        message: "Please verify your account",
        success: false
    });
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



export async function logoutController(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(200).json({
                message: "Already logged out",
                success: true
            });
        }

        // ✅ clear cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        // ✅ check if already blacklisted (optional)
        const isBlacklisted = await redis.get(token);

        if (!isBlacklisted) {
            const decoded = jwt.decode(token);

            if (decoded?.exp) {
                const expiry = Math.max(
                    decoded.exp - Math.floor(Date.now() / 1000),
                    0
                );

                if (expiry > 0) {
                    await redis.set(token, "blacklisted", "EX", expiry);
                }
            }
        }

        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        });

    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}
