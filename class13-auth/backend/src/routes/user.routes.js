const express = require("express")
const UserController = require("../controllers/user.controller")
const authRoutes = express.Router()


authRoutes.post("/register", UserController.registerRoutes )

authRoutes.post("/login", UserController.loginRoutes)


authRoutes.post("/logout", UserController.logoutRoutes)



module.exports = authRoutes