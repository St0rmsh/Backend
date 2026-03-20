import {Router} from "express"
import { registerController,loginController } from "../controllers/auth.controller.js"
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




export default authRoutes