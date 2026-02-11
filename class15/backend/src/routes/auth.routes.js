const express = require("express")
const userController = require("../controller/user.controller")


const authRoute = express.Router()

authRoute.post("/register", userController.registerController)
authRoute.post("/login", userController.loginController)
authRoute.post("/logout", userController.logoutController)




module.exports = authRoute