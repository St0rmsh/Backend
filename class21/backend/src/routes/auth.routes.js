const express = require("express")
const authController = require("../controllers/auth.controller")

const authRoutes = express.Router()

authRoutes.post("/register",authController.registerController)
authRoutes.post("/login",authController.loginController)






module.exports = authRoutes