import express from "express";
import {registerValidator, loginValidator} from "../validation/auth.validation.js";
import {getUser, loginController,logoutController,refreshAccessTokenController,registrationController} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const authRouter = express.Router()

authRouter.post("/register",registerValidator,registrationController)

authRouter.post("/login",loginValidator,loginController)

authRouter.get("/me",authMiddleware,getUser)

authRouter.post("/refresh-access-token",refreshAccessTokenController)

authRouter.post("/logout",authMiddleware,logoutController)

export default authRouter