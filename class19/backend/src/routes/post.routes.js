const express = require("express")
const postController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})

const postRoute = express()

postRoute.post("/", upload.single("imgUrl") ,postController.createPost)

postRoute.get("/",postController.fetchPost)

postRoute.get("/:id", postController.fetchOnePost)




module.exports = postRoute