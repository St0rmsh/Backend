const multer = require("multer")

const storage = multer.memoryStorage()

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*20
    }
})


module.exports = upload