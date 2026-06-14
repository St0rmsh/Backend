import { Router } from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { createPostController } from "../controller/Posts.controller.js"
import uploadFile from "../middleware/multer.js"


const PostRouter = Router()



PostRouter.post("/create",authMiddleware,uploadFile.single("coverImage"),createPostController)




export default PostRouter