const express = require("express")
const userController = require("../controller/user.controller")
const authMiddleware = require("../middleware/auth.middleware")

const userRoutes = express.Router()







// api ->  post http://localhost:3000/api/user/follow/username 

// @ routes -> /api/user/follow/username

// description -> Follow user 

userRoutes.post("/follow/:username", authMiddleware, userController.Follow)



// api ->  post http://localhost:3000/api/user/unfollow/username 

// @ routes -> /api/user/unfollow/username

// description -> Unfollow user
userRoutes.post("/unfollow/:username",authMiddleware, userController.unFollow)


module.exports = userRoutes