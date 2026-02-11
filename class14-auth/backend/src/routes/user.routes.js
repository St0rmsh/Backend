const express = require("express")
const userControllers = require("../controllers/user.controller")

const authRoutes = express.Router()


authRoutes.post("/register", userControllers.registerRoute)
authRoutes.post("/login", userControllers.loginRoute)
authRoutes.post("/logout", userControllers.logoutRoute)



module.exports = authRoutes