import { Router } from "express";
import { registerValidator, loginValidator, completeProfileValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth.validator.js";
import { registerUser, loginUser, getMe, googleAuth, completeProfile, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();


authRouter.post('/register', registerValidator, registerUser);

authRouter.post('/login', loginValidator, loginUser);

authRouter.get('/getMe', authMiddleware, getMe);

authRouter.put('/complete-profile', authMiddleware, completeProfileValidator, completeProfile);

authRouter.post('/forgot-password', forgotPasswordValidator, forgotPassword);

authRouter.post('/reset-password/:token', resetPasswordValidator, resetPassword);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login', session: false }), googleAuth);

export default authRouter;