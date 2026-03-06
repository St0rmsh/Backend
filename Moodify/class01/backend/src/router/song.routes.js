const express = require("express")
const upload = require("../middleware/upload.middleware")
const songController = require("../controller/song.controller")
const songRouter = express.Router()


songRouter.post("/",upload.single("song"),songController.uploadSong)

songRouter.get("/",songController.getSongs)




module.exports = songRouter