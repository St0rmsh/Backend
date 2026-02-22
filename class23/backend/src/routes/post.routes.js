const express = require("express")
const IdentifyUser = require("../middleware/auth.middleware")
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRoutes = express.Router()





postRoutes.post("/",upload.single("imgUrl"),IdentifyUser,postController.createPost)


postRoutes.get("/",IdentifyUser,postController.fetchAllPosts)

postRoutes.get("/:postid",IdentifyUser,postController.fetcOnePost)


postRoutes.post("/like/:postid",IdentifyUser,postController.likePost)

postRoutes.post("/dislike/:postid",IdentifyUser,postController.dislikePost)


module.exports = postRoutes