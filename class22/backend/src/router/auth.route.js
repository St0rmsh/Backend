const express = require("express")
const authController = require("../controller/auth.controller")
const authRoutes = express.Router()
const authMiddleware = require("../middleware/auth.middleware")


authRoutes.post("/register", authController.registerController)
authRoutes.post("/login",authController.loginController)
authRoutes.get("/getMe",authMiddleware,authController.getMe)

module.exports = authRoutes