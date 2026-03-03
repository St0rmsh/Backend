const {Router} = require("express")
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const authRouter = Router()



authRouter.post("/register",authController.registerController)

authRouter.post("/login", authController.loginController)

authRouter.get("/getMe",authMiddleware.IdentifyUser,authController.GetMe)

authRouter.get("/logout",authMiddleware.IdentifyUser,authController.logout)

module.exports = authRouter