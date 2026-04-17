import { Router } from "express";
import { validateRegister } from "../validation/auth.validation.js";
import { registerController } from "../controller/auth.controller.js";

const router = Router()



// @desc Register a new user
// @route POST /api/v1/auth/register
// @access Public
router.post("/register",validateRegister,registerController )


// @desc Login a user
// @route POST /api/v1/auth/login
// @access Public
// router.post("/login", )



// @desc Logout a user
// @route POST /api/v1/auth/logout
// @access Private
// router.post("/logout", )

export default router