const express = require("express")
const createPost = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({storage:multer.memoryStorage()})


const postRoute = express.Router()

postRoute.post("/", upload.single("imgUrl"),createPost)




module.exports = postRoute