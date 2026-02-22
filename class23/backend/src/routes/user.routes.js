const express = require("express")
const IdentifyUser = require("../middleware/auth.middleware")
const followController = require("../controllers/follow.controller")
const userRoutes = express.Router()





userRoutes.post("/follow/:username",IdentifyUser,followController.Follow)


userRoutes.post("/unfollow/:username",IdentifyUser,followController.unFollow)


module.exports = userRoutes