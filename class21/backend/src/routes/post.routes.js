const express = require("express")
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const IdentifyUser = require("../middleware/auth.middleware")

const postRoute = express.Router()

postRoute.post("/", upload.single("imgUrl"),IdentifyUser , postController.createPost)

postRoute.get("/", IdentifyUser,postController.fetchAllPosts)


postRoute.get("/:id",IdentifyUser,postController.fetchOnePost)


module.exports = postRoute