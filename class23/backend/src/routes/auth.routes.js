const express = require("express")
const authController = require("../controllers/auth.controller")
const IdentifyUser = require("../middleware/auth.middleware")

const authRoutes = express.Router()


authRoutes.post("/register",authController.registerController)


authRoutes.post("/login",authController.loginController)


authRoutes.get("/getMe",IdentifyUser,authController.getMe)




module.exports = authRoutes