const {Router} = require("express")
const authController = require("../controller/auth.controller")
const IdentifyUser = require("../middleware/auth.middleware")
const authRouter = Router()



authRouter.post("/register",authController.registerController)

authRouter.post("/login", authController.loginController)

authRouter.get("/getMe",IdentifyUser,authController.GetMe)

authRouter.get("/logout",IdentifyUser,authController.logout)

module.exports = authRouter