const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const {toFile}= require("@imagekit/nodejs")
const mongoose = require("mongoose")


const JWT_SECRET = process.env.JWT_SECRET

const imageKit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPost(req,res){

    const token = req.cookies.token

    let decoded = null

    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message:"Incorrect Token"
        })
    }

    const file = imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: req.file.originalname,
        folder:"insta-cole"
    })

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:decoded.id
    })

    res.status(201).json({
        message:"Post created Successfully",
        post
    })
}

async function fetchPost(req,res){
    const token = req.cookies.token

    let decoded = null

    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

    const userId = decoded.id


    const fetchPost = await postModel.find({
        user:userId
    })

    if (!fetchPost) {
        return res.status(404).json({
            message:"No Post Found"
        })
    }

    res.status(200).json({
        message:"Post Fetched Successfully",
        fetchPost
        
    })
}

async function fetchOnePost(req,res){
    const token = req.cookies.token

    let decoded = null 

    try {
        decoded= jwt.verify(token,JWT_SECRET)
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

    const userId = decoded.id
    const id = req.params.id

       if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(404).json({
            message:"Post not found"
        })
        
       }

    const onePost = await postModel.findById(id)

    if (!onePost) {
        return res.status(404).json({
            message:"Post Not Found"
        })
    }

    res.status(200).json({
        message:"Post fetched",
        onePost
    })
}


module.exports = {
    createPost,
    fetchPost,
    fetchOnePost
}