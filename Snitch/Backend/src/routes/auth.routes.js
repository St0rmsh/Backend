import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { registerUser, loginUser, getMe, googleAuth, completeProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";
import passport from "passport";


const authRouter = Router();


authRouter.post('/register', registerValidator, registerUser);

authRouter.post('/login', loginValidator, loginUser);

authRouter.get('/getMe', authMiddleware, getMe);

authRouter.put('/complete-profile', authMiddleware, completeProfile);

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), googleAuth);

export default authRouter;