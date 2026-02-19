const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const { default: mongoose } = require("mongoose")



const imageKit = new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})


async function createPost(req,res) {
  

    

 try {
       const file = await  imageKit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: req.file.originalname,
        folder: "Insta-Clone"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
    })

    res.status(201).json({
        message:"Post created Successfully",
        post
    })
 } catch (error) {
    return res.status(500).json({
        message:"Server Error"
    })
 }


}

async function fetchAllPosts(req,res){

   try {
     const userId = req.user.id

    const fetchPosts = await postModel.find({
        user:userId
    })

    if (fetchPosts.length === 0) {
        return res.status(404).json({
            message:"No Post found"
        })
    }

    res.status(200).json({
        message:"Posts Fetched",
        fetchPosts
    })
   } catch (error) {
    return res.status(500).json({
        message:"Server Error"
    })
   }
}


async function fetchOnePost(req,res){

   try {
     const id = req.params.id
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message:"Invalid post"
        })
    }

    const OnePostFetch = await postModel.findById(id)

    if (!OnePostFetch) {
        return res.status(404).json({
            message:"Post not Found"
        })
    }

    if (!OnePostFetch.user.equals(userId)) {
        return res.status(403).json({
            message:"Unauthorized user"
        })
    }
  

    

    res.status(200).json({
        message:"Post Fetched",
        OnePostFetch
    })
   } catch (error) {
    return res.status(500).json({
        message:"Server Error"
    })
   }
}




module.exports = {
    createPost,
    fetchAllPosts,
    fetchOnePost
}