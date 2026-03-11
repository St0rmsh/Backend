import { Router } from "express";
import { registerValidator } from "../validation/auth.validation.js";
import {registerController} from "../controller/auth.controller.js"
const AuthRouter = Router()


AuthRouter.post("/register",registerValidator,registerController)



export default AuthRouter