const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")



const imagekit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPost(req,res) {

    const token = req.cookies.token

    let decoded = null

    try {
        decoded =  jwt.verify(token, process.env.JWT_SECERET)
    } catch (error) {
        return res.status(401).json({
            message:"invalid User"
        })
    }

  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: req.file.originalname,
    folder:"Insta-cole"
  })

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: decoded.id
    
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
        decoded = jwt.verify(token,process.env.JWT_SECERET)
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

    const userId = decoded.id

    const posts = await postModel.find({
         user: userId
    })

    res.status(200).json({
        message:"Post fetch Successfully",
        posts
    })
}

async function fetchOnePost(req,res) {
    

    const token = req.cookies.token

    let decoded = null 

    try {
        decoded = jwt.verify(token, process.env.JWT_SECERET)
    } catch (error) {
        return res.status(401).json({
            message:"Invlaid token"
        })
    }

    const id = req.params.id
    const userId = decoded.id

    const post = await postModel.findById(id)

    if (!post) {
        return res.status(404).json({
            message:"Post not Found"
        })
    }

    res.status(200).json({
        message:"Post Fetched Successfull",
        userId,
        post
    })
}





module.exports = {
    createPost,
    fetchPost,
    fetchOnePost
}