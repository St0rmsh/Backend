const express = require("express")
const authController = require("../controllers/user.controller")

const authRoute = express.Router()


authRoute.post("/register", authController.registerController)
authRoute.post("/login", authController.loginController)





module.exports = authRoute