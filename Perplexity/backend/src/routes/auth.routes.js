import { Router } from "express";
import {registerController,verifyEmailController,loginController,getMeController,resendVerificationEmailController} from "../controller/auth.controller.js"
import {validateRegister,validateLogin} from "../Validation/auth.validation.js"
import { authMiddleware } from "../middleware/auth.middleware.js";


const AuthRouter = Router()

// Register Route
// @route POST /api/auth/register
// @desc Register a new user

AuthRouter.post("/register",validateRegister,registerController)



// Login Route
// @route POST /api/auth/login
// @desc Login a user and return JWT token
AuthRouter.post("/login",validateLogin,loginController)



// Email Verification Route
// @route GET /api/auth/verify-email
// @desc Verify user's email address
AuthRouter.get("/verify-email",verifyEmailController)


// Get Current User Route
// @route GET /api/auth/getMe
// @desc Get current logged in user's details

AuthRouter.get("/getMe",authMiddleware,getMeController)


AuthRouter.post("/resend-email",resendVerificationEmailController)

export default AuthRouter