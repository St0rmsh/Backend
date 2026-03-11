import { Router } from "express";
import {registerController} from "../controller/auth.controller.js"
import {validateRegister,validateLogin} from "../Validation/auth.validation.js"

const AuthRouter = Router()


AuthRouter.post("/register",validateRegister,registerController)




export default AuthRouter