import { Router } from "express";
import { registerValidator, loginValidator, completeProfileValidator, forgotPasswordValidator, resetPasswordValidator } from "../validators/auth.validator.js";
import { registerUser, loginUser, getMe, googleAuth, completeProfile, forgotPassword, resetPassword, logoutUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import passport from "passport";
import { config } from "../config/config.js";

const authRouter = Router();

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
authRouter.post('/register', registerValidator, registerUser);

// @desc Login a user
// @route POST /api/auth/login
// @access Public
authRouter.post('/login', loginValidator, loginUser);

// @desc Get current user
// @route GET /api/auth/getMe
// @access Private
authRouter.get('/getMe', authMiddleware, getMe);

// @desc Complete profile
// @route PUT /api/auth/complete-profile
// @access Private
authRouter.put('/complete-profile', authMiddleware, completeProfileValidator, completeProfile);

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
authRouter.post('/forgot-password', forgotPasswordValidator, forgotPassword);

// @desc Reset password
// @route POST /api/auth/reset-password/:token
// @access Public
authRouter.post('/reset-password/:token', resetPasswordValidator, resetPassword);

// @desc Google auth
// @route GET /api/auth/google
// @access Public
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// @desc Google auth callback
// @route GET /api/auth/google/callback
// @access Public
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: config.NODE_ENV === 'development' ? 'http://localhost:5173/login' : '/login', session: false }), googleAuth);

// @desc Logout user
// @route POST /api/auth/logout
// @access Private
authRouter.post('/logout', authMiddleware, logoutUser);

export default authRouter;