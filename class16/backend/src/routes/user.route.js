const express = require("express")
const userController = require("../controllers/user.controller")

const authRoute = express.Router()


authRoute.post("/register", userController.registerController)
authRoute.post("/login", userController.loginController)




module.exports = authRoute