import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getUserProfileController } from "../controller/UserProfile.controller.js";

const userProfileRouter = Router();

userProfileRouter.get("/:userId", authMiddleware, getUserProfileController);

export default userProfileRouter;
