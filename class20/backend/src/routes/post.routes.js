const express = require("express")
const postController = require("../controller/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})
const postRoutes = express.Router()


postRoutes.post("/",upload.single("imgUrl"),postController.createPost)

postRoutes.get("/",postController.fetchPost)

postRoutes.get("/:id",postController.fetchOnePost)



module.exports = postRoutes