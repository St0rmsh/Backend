const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const postController = require("../controller/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const postRoutes = express.Router()
const CommentController = require("../controller/Comment.controller")


// api -> post / http://localhost:3000/api/post/

// /api/post/
// @ description create post when user is loggedIn
postRoutes.post("/",upload.single("imgUrl"),authMiddleware,postController.createPost)




// api -> get / http://localhost:3000/api/post/

// /api/get/
// @ description fetch all post when user is loggedIn
postRoutes.get("/",authMiddleware,postController.fetchPosts)



// api -> get / http://localhost:3000/api/post/:id

// /api/get/
// @ description fetch one post when user is loggedIn

postRoutes.get("/user/:id", authMiddleware,postController.fetchOnePost)



postRoutes.post("/like/:id",authMiddleware,postController.likePost)


postRoutes.post("/dislike/:id", authMiddleware,postController.dislikePost)


postRoutes.get("/feed",authMiddleware,postController.getFeed)






postRoutes.post("/comment/:postId",authMiddleware,CommentController.createComment)




module.exports = postRoutes