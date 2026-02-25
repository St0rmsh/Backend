const postModel = require("../models/post.models")
const disikeModel = require("../models/disliked.model")
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const mongoose = require("mongoose")
const LikeModel = require("../models/Likes.models")
const likeModel = require("../models/Likes.models")
const imagekit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPost(req,res){

    const userId = req.user.id

    if (!req.file) {
        return res.status(400).json({
            message:"Image is required"
        })
    }

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName:req.file.originalname,
        folder:"Insta-Clone"
    })

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:userId
    })

    if (!post) {
        return res.status(400).json({
            message:"You need to create a post"
        })
    }

    res.status(201).json({
        message:"post Created Successfully",
        post
    })


}


async function fetchPosts(req,res){

    const userId = req.user.id

    const post = await postModel.find({
        user:userId
    })



    res.status(200).json({
        message:"fetched Posts",
        post
    })
}


async function fetchOnePost(req,res){

    const id = req.params.id
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).json({
            message:"Invalid post"
        })
    }

    const post = await postModel.findById(id)

    if (!post) {
        return res.status(404).json({
            message:'Post not Found'

        })
    }


    if (!post.user.equals(userId)) {
        return res.status(403).json({
            message:"Invalid User"
        })
    }
    


    res.status(200).json({
        message:"Post fetched",
        post
    })
}


async function likePost(req,res){
   const postId = req.params.id

   if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(404).json({
        message:"Invalid Post"
    })
   }

   const username = req.user.username

   const post = await postModel.findById(postId)

   if (!post) {
    return res.status(400).json({
        message:"Post not found"
    })
   }

   const isAlreadyLiked = await LikeModel.findOne({
    post:postId,
    user:username
   })

   if (isAlreadyLiked) {
    return res.status(200).json({
        message:"You have already liked the post"
    })
   }
   const disliked = await disikeModel.findOneAndDelete({
        post:postId,
        user:username
    })

   const like = await LikeModel.create({
    post:postId,
    user:username
   })



   res.status(200).json({
    message:"You liked the post ",
    like
   })


}


async function dislikePost(req,res){
    const postId = req.params.id
    const username = req.user.username

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(404).json({
            message:"Invalid post id"
        })
    }
    

    await LikeModel.findOneAndDelete({
    post:postId,
    user:username
   })

   const isAlreadyDisliked = await disikeModel.findOne({
    post:postId,
    user:username
   })

   if (isAlreadyDisliked) {
    return res.status(200).json({
        message:"You have Already Disliked the post"
    })
   }

    await disikeModel.create({
    post:postId,
    user:username
   })


    res.status(200).json({
        message:"You dislike post "
    })


}


async function getFeed(req,res){
    const user = req.user

    const post = await Promise.all((await postModel.find().populate("user").lean())
    .map(async(post)=>{
        const isLiked = await likeModel.findOne({
            user:user.username,
            post:post._id
        })

        post.isLiked = Boolean(isLiked)
        
        return post
    }))


    res.status(200).json({
        message:"Post fetched Successfully",
        post
    })


}

module.exports = {
    createPost,
    fetchPosts,
    fetchOnePost,
    likePost,
    dislikePost,
    getFeed
}