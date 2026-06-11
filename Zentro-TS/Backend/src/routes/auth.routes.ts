import express from "express";
import {registerValidator, loginValidator} from "../validation/auth.validation.js";
import {getUser, loginController,logoutController,refreshAccessTokenController,registrationController, updateUserController, verifyOtpController,sendOtpController, changePasswordController} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import uploadFile from "../middleware/multer.js";

const authRouter = express.Router()



//@Method         POST
//@Route          /api/v1/auth/register
//@Description    Register a new user
//@Access         Public
authRouter.post("/register",registerValidator,registrationController)




//@Method         POST
//@Route          /api/v1/auth/login
//@Description    Login a new user
//@Access         Public
authRouter.post("/login",loginValidator,loginController)




//@Method         GET
//@Route          /api/v1/auth/me
//@Description    Get current user profile
//@Access         Private
authRouter.get("/me",authMiddleware,getUser)




//@Method         POST
//@Route          /api/v1/auth/refresh-access-token
//@Description    Refresh access token
//@Access         Public
authRouter.post("/refresh-access-token",refreshAccessTokenController)




//@Method         POST
//@Route          /api/v1/auth/logout
//@Description    Logout a user
//@Access         Private
authRouter.post("/logout",authMiddleware,logoutController)




//@Method         PATCH
//@Route          /api/v1/auth/update-profile
//@Description    Update user profile
//@Access         Private
authRouter.patch("/update-profile",authMiddleware,uploadFile.fields([{ name: "avatar", maxCount: 1 },
        { name: "banner", maxCount: 1 }]),updateUserController)




//@Method         POST
//@Route          /api/v1/auth/send-otp
//@Description    Send OTP to user
//@Access         Private
authRouter.post("/send-otp",authMiddleware,sendOtpController)




//@Method         POST
//@Route          /api/v1/auth/verify-otp
//@Description    Verify OTP
//@Access         Private
authRouter.post("/verify-otp",authMiddleware,verifyOtpController)



//@Method        
//@Route          
//@Description    
//@Access    

authRouter.patch("/change-password",authMiddleware,changePasswordController)


export default authRouter