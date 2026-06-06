import express from "express";
import {registerValidator} from "../validation/auth.validation.js";
import {registrationController} from "../controller/auth.controller.js";


const authRouter = express.Router()

authRouter.post("/register",registerValidator,registrationController)


export default authRouter