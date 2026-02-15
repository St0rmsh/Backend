const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const postModel = require("../models/post.model")
const userModel = require("../models/user.model")


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPost(req,res){


    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: req.file.originalname
    })
    
    const token = req.cookies.token

    let decoded = null

    try {
     decoded = jwt.verify(token,process.env.JWT_SECERET)
    } catch (error) {
        return res.status(409).json({
            message:"Invalid user"
        })
    }

    const post = await postModel.create({
       caption: req.body.caption,
       imgUrl: file.url,
       user: decoded.id
    })

    res.status(201).json({
        message:"post created Successfully",
        post
    })
}


module.exports = createPost