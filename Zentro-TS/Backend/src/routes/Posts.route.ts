import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { createPostController, deletePostController, getALLPostsController, getSinglePostController, getUserPostsController, searchPostController, updatePostController } from "../controller/Posts.controller.js"
import uploadFile from "../middleware/multer.js"


const PostRouter = Router()


// @route: POST /api/posts/create
// @desc: Create a new post
// @access: Private
PostRouter.post("/create",authMiddleware,uploadFile.single("coverImage"),createPostController)


// @route: GET /api/posts
// @desc: Get all posts
// @access: Private
PostRouter.get("/",authMiddleware,getALLPostsController)

// @route: GET /api/posts/user/:userId
// @desc: Get all posts by user
// @access: Private
PostRouter.get("/user/:userId",authMiddleware,getUserPostsController)


// @route: GET /api/posts/:postId
// @desc: Get single post
// @access: Private
PostRouter.get("/:postId",authMiddleware,getSinglePostController)


// @route: PATCH /api/posts/:postId
// @desc: Update a post
// @access: Private
PostRouter.patch("/:postId",authMiddleware,updatePostController)


// @route: DELETE /api/post/:postId
// @desc delete's a post
// @access: Private
PostRouter.delete("/:postId",authMiddleware, deletePostController)


// @route: GET /api/posts/search/:query
// @desc: Search posts
// @access: Public
PostRouter.get("/search/:query",searchPostController)

export default PostRouter