import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { createPostController, getALLPostsController } from "../controller/Posts.controller.js"
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



export default PostRouter