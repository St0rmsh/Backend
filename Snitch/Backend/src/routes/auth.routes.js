import { Router } from "express";
import { registerValidator, loginValidator, completeProfileValidator } from "../validators/auth.validator.js";
import { registerUser, loginUser, getMe, googleAuth, completeProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();


authRouter.post('/register', registerValidator, registerUser);

authRouter.post('/login', loginValidator, loginUser);

authRouter.get('/getMe', authMiddleware, getMe);

authRouter.put('/complete-profile', authMiddleware, completeProfileValidator, completeProfile);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login', session: false }), googleAuth);

export default authRouter;