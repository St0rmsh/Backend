import UserModel from "../model/auth.model.js";
import type { LoginBody, RegisterBody, UpdateUserBody } from "../types/Auth/user.types.js";
import jwt from "jsonwebtoken"
import config from "../config/config.js"
import type { JwtPayload } from "../types/Jwt/payload.types.js";
import redisClient from "../config/cache.js";
import otpGenerate from "../utils/otp.js";
import otpModel from "../model/otp.model.js";
import sendEmail from "./email.service.js";
import { uploadBuffer } from "../config/storage.js";
import { forgotPasswordTemplate } from "../template/forgotPassword.js";
import { verifyEmail } from "../template/verifyEmail.js";

// Register user service

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


// Login user service

export const loginUserService = async (data:LoginBody) =>{
    try {

        const {email,password,username} = data

        if ((!email && !username) || !password) {
            throw new Error(
                "Email/Username and password are required"
            );
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


// Get my profile service

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




// Generate access token service
export const generateAccessTokenService = async (refreshToken:string) => {
    try {

        const isBlacklisted = await redisClient.get(`logout:${refreshToken}`);

        if (isBlacklisted) {
            throw new Error("Refresh token revoked");
        }

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



// Logout service
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



// Update user details service
export const updateUserDetailsService = async (id:string,data:UpdateUserBody , files?: {
        avatar?: Express.Multer.File[];
        banner?: Express.Multer.File[];
    }) =>{
    try {
        
        const user = await UserModel.findById(id);

    if (!user) {
        throw new Error("User not found");
    }

    let avatarUrl = user.avatar;
    let bannerUrl = user.banner;

        console.log("Avatar file:", files?.avatar?.[0]);
console.log("Banner file:", files?.banner?.[0]);


    if (files?.avatar?.[0]) {

        const avatarResult = await uploadBuffer({
            buffer: files.avatar[0].buffer,
            fileName: `avatar-${Date.now()}-${files.avatar[0].originalname}`,
            folder: "Zentro/users/avatar"
        });

        console.log("Avatar Upload Result:", avatarResult);


        if (!avatarResult.url) {
            throw new Error("Avatar upload failed");
        }

        avatarUrl = avatarResult.url;
    }

    if (files?.banner?.[0]) {

        const bannerResult = await uploadBuffer({
            buffer: files.banner[0].buffer,
            fileName: `banner-${Date.now()}-${files.banner[0].originalname}`,
            folder: "Zentro/users/banner"
        });

        console.log("Banner Upload Result:", bannerResult);


        if (!bannerResult.url) {
            throw new Error("Banner upload failed");
        }

        bannerUrl = bannerResult.url;
    }



    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        {
            ...data,
            avatar: avatarUrl,
            banner: bannerUrl
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullname: updatedUser.fullname,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        banner: updatedUser.banner
    }

    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}




// Otp services
export const sendOtpService = async (email:string)=>{
    
    try {

        const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const existingOTP = await otpModel.findOne({
        email,
        type: "verify-email"
    });

   if (existingOTP) {

    if (existingOTP.expiresAt > new Date()) {

        const remainingTime = Math.ceil(
            (existingOTP.expiresAt.getTime() - Date.now()) / 1000
        );

        throw new Error(
            `OTP already sent. Try again in ${remainingTime} seconds`
        );
    }

    await otpModel.deleteOne({
        _id: existingOTP._id
    });
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
            type:"verify-email",
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
        html: verifyEmail(otp)
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




// Verify otp service

export const verifyOtpService = async (
  email: string,
  otp: string
) => {

  const otpDoc = await otpModel.findOne({
    email,
    type: "verify-email",
  });

  if (!otpDoc) {
    throw new Error("OTP not found");
  }

  if (otpDoc.expiresAt < new Date()) {
    await otpModel.deleteOne({
      _id: otpDoc._id,
    });

    throw new Error("OTP expired");
  }

  if (otpDoc.attempts >= 5) {
    await otpModel.deleteOne({
      _id: otpDoc._id,
    });

    throw new Error(
      "Maximum OTP attempts exceeded"
    );
  }

  if (otpDoc.otp !== otp) {
    otpDoc.attempts += 1;

    await otpDoc.save();

    throw new Error("Invalid OTP");
  }

  const user = await UserModel.findOne({
    email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  user.isVerified = true;

  await user.save();

  await otpModel.deleteOne({
    _id: otpDoc._id,
  });

  return {
    success: true,
    message: "Email verified successfully",
  };
};


// Change password Service 

export const changePasswordService = async (email:string,oldPassword:string,newPassword:string)=>{
    try {

        const user = await UserModel.findOne({ email });
        if(!user){
            throw new Error("User not found")
        }

        const isPasswordValid = await user.comparePassword(oldPassword);

        if(!isPasswordValid){
            throw new Error("Invalid Password")
        }

        if (!oldPassword || !newPassword) {
            throw new Error("Old password and new password are required")
        }

        if (oldPassword === newPassword) {
            throw new Error("New password cannot be same as old password");
        }

        user.password = newPassword
        await user.save();

        return {
            success: true,
            message: "Password changed successfully"
        };
        
    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}



// Forgot password service 

export const forgotPasswordService = async (email:string)=>{
    try {
        
         const user = await UserModel.findOne({ email});

         if(!user){
            throw new Error("User not found")
         }

         if (!user.isVerified) {
            throw new Error("Please verify your email first");
        }

        const existingOTP = await otpModel.findOne({ email,  type: "reset-password" });


        if (existingOTP) {

            if (existingOTP.expiresAt > new Date()) {

        const remainingTime = Math.ceil(
            (existingOTP.expiresAt.getTime() - Date.now()) / 1000
        );

        throw new Error(
            `OTP already sent. Try again in ${remainingTime} seconds`
        );
    }

    await otpModel.deleteOne({
        _id: existingOTP._id
    });
}

    const otp = otpGenerate();

const otpDoc = await otpModel.findOneAndUpdate(
    { email },
    {
        email,
        otp,
        type: "reset-password",
        expiresAt: new Date(Date.now() + 60 * 1000),
        attempts: 0
    },
    {
        upsert: true,
        new: true
    }
);

console.log("Saved OTP:", otpDoc);

   
    await sendEmail({
        email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}`,
        html:  forgotPasswordTemplate(otp)
    });

    return {
        success: true,
        message: "Password reset OTP sent successfully"
    };

    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}





//  Reset Password Service 

export const resetPasswordService = async (email:string,newPassword:string,otp:string)=>{
    try {

    const otpDoc = await otpModel.findOne({
        email: new RegExp(`^${email}$`, "i"),
        type: "reset-password"
    });


    if (!otpDoc) {
        throw new Error("OTP not found");
    }

    if (otpDoc.expiresAt < new Date()) {

        await otpModel.deleteOne({
            _id: otpDoc._id
        });

        throw new Error("OTP expired");
    }

    if (otpDoc.attempts >= 5) {

        await otpModel.deleteOne({
            _id: otpDoc._id
        });

        throw new Error("Maximum OTP attempts exceeded");
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

    const isSamePassword =
    await user.comparePassword(newPassword);

    if (isSamePassword) {
    throw new Error(
        "New password cannot be same as old password"
    );
    }

    user.password = newPassword;

    await user.save();

    await otpModel.deleteOne({
        _id: otpDoc._id
    });

    return {
        success: true,
        message: "Password reset successfully"
    };
      

      

    } catch (error) {
        console.error("Error in user service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}