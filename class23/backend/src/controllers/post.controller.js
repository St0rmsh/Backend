const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const { default: mongoose } = require("mongoose")
const likeModel = require("../models/like.models")
const dislikeModel = require("../models/unlike.model")


const imageKit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPost(req,res) {

    const userId= req.user.id

    const file = await imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName:req.file.originalname,
        folder:"insta"
    })

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:userId
    })

    if (!post) {
        return res.status(404).json({
            message:"Image is required to create post"
        })
    }



    res.status(201).json({
        message:"Post created Successfully",
        post
    })
    
}


async function fetchAllPosts(req,res){
    const userId = req.user.id

    if (!userId) {
        return res.status(401).json({
            message:"Token not found"
        })
    }

    const post = await postModel.find({user:userId})

    if (post.length === 0) {
        return res.status(404).json({
            message:"No post found"
        })
    }

    res.status(200).json({
        message:"Posts Fetched Successfully",
        post
    })
}

async function fetcOnePost(req,res){

    const userId = req.user.id

    if (!userId) {
        return res.status(403).json({
            message:"Invlid User"
        })
    }

    const id = req.params.postid

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message:"Invalid post"
        })
    }


    const post = await postModel.findById(id)


    if (!post) {
        return res.status(404).json({
            message:"post not found"
        })
    }

    
    if (post.user._id.toString() !== userId) {
        return res.status(401).json({
            message:"You cannot Access Other's Posts"
        })
    }
    

    res.status(200).json({
        message:"Post Fetched Successfully",
        post
    })
}


async function likePost(req,res){

    const userId = req.user.id

    if (!userId) {
        return res.status(403).json({
            message:"Invalid Token"
        })
    }

    const postId = req.params.postid

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(404).json({
            message:"Invalid post"
        })
    }

    const isPostExists = await postModel.findById({_id:postId})

    if(!isPostExists){
        return res.status(404).json({
            message:"Post not found"
        })
    }

      await dislikeModel.findOneAndDelete({post:postId})
    

    

    await likeModel.create({
        post:postId,
        user:req.user.username
    })

    res.status(201).json({
        message:"Post liked"
    })



}


async function dislikePost(req,res){

    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({
            message:"Invalid token"
        })
    }

    const postId = req.params.postid

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(403).json({
            message:"Invalid post"
        })
    }

    const isPostExists = await postModel.findById({_id:postId})

    if (!isPostExists) {
        return res.status(404).json({
            message:"Post does not exists"
        })
    }

    const isAlreadydisliked = await dislikeModel.findById({_id:postId})

    if (isAlreadydisliked) {
        return res.status(200).json({
            message:"you have already disliked the post"
        })
    }

        
     await likeModel.findOneAndDelete({post:postId})
    
    

    await dislikeModel.create({
        post:postId,
        user:req.user.username
    })

    res.status(200).json({
        message:"You Unliked the Post successfully"
    })


}


module.exports = {
    createPost,
    fetchAllPosts,
    fetcOnePost,
    likePost,
    dislikePost
}