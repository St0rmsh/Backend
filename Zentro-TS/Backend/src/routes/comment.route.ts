import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { commentController } from "../controller/comment.controller.js";


const CommentRouter = Router()


// @route: POST /api/comment/:postId
// @desc: Create a new comment
// @access: Private
CommentRouter.post("/post/:postId",authMiddleware,commentController)

export default CommentRouter