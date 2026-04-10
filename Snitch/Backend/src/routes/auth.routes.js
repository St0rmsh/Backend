import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { registerUser,loginUser,getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";



const authRouter = Router();


authRouter.post('/register', registerValidator, registerUser);

authRouter.post('/login', loginValidator, loginUser);

authRouter.get('/getMe', authMiddleware,getMe);

export default authRouter;