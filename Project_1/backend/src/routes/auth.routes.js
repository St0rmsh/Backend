import {Router} from "express"
import { registerController,loginController,getMeController, logoutController } from "../controllers/auth.controller.js"
import { registerValidation, loginValidation } from "../Validation/auth.validation.js"
import { authMiddleware } from "../middleware/auth.middleware.js"


const authRoutes = Router()


// Register
// POST 
// /api/auth/register
authRoutes.post("/register", registerValidation, registerController)

// Login
// POST 
// /api/auth/login
authRoutes.post("/login", loginValidation, loginController)


// Get Me
// GET
// /api/auth/getMe
authRoutes.get("/getMe",authMiddleware,getMeController)


// Logout
// POST
// /api/auth/logout
authRoutes.post("/logout",authMiddleware, logoutController)

export default authRoutes