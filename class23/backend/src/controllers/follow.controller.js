const followModel = require("../models/follow.models")
const userModel = require("../models/user.models")



async function Follow(req,res) {
    const userId = req.user.id

    if (!userId) {
        return res.status(401).json({
            message:"Token not found"
        })
    }

    const followeeUsername = req.params.username


    if (req.user.username === followeeUsername) {
        return res.status(200).json({
            message:"You Can't follow YourSelf"
        })
    }


    const followee = await userModel.findOne({username:followeeUsername})

    if (!followee) {
        return res.status(404).json({
            message:"User does not Exsist"
        })
    }

     const isAlreadyFollowed = await followModel.findOne({
        follower:userId,
        followee:followee._id
    })

     if (isAlreadyFollowed) {
        return res.status(200).json({
            message:"You Already Followed "
        })
    }

    


     await followModel.create({
        follower:req.user.username,
        followee:followee.username
    })

    res.status(201).json({
        message:`You followed ${followeeUsername}`
    })


    
}






async function unFollow(req,res){

    const userId = req.user.id

    if (!userId) {
        return res.status(403).json({
            message:"Token not found"
        })
    }

    const follower = req.user.username

    const followeeUsername = req.params.username


    if (follower === followeeUsername) {
        return res.status(403).json({
            message:"You can't unfollow Yourself"
        })
    }

    const followingUser = await followModel.findOne({
        follower:follower,
        followee:followeeUsername
    })

    if (!followingUser) {
        return res.status(403).json({
            message:"You are not Following "
        })
    }
    await followModel.findOneAndDelete({
        follower:follower,
        followee:followeeUsername
    })

    res.status(200).json({
        message:"Unfollowed Successfully "+followeeUsername
    })


}





module.exports = {
    Follow,
    unFollow
}