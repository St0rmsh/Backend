const postModel = require("../models/post.model")
const jwt = require('jsonwebtoken')
const Imagekit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")


const imagekit = new Imagekit({
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
        decoded = await jwt.verify(token, process.env.JWT_SECERET)
    } catch (error) {
        return res.status(401).json({
            message:"Invalid User",
            error
        })
    }

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })

    res.status(201).json({
        message:"Post cretaed Successfully",
        post
    })
}

module.exports = {
    createPost
}