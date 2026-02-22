const followModel = require("../models/follow.model")
const userModel = require("../models/user.models")


async function Follow(req,res){

   const followerUsername = req.user.username

   const followeeUsername = req.params.username

   if (followerUsername === followeeUsername) {
    return res.status(404).json({
        message:"You Can't follow YourSelf"
    })
   }

   const isFollowerExists = await userModel.findOne({
    username:followeeUsername
   })

   if (!isFollowerExists) {
    return res.status(400).json({
        message:"Follower does not Exists"
    })
   }

   const isAlreadyFollowing = await followModel.findOne({
    follower:followerUsername,
    followee:followeeUsername,
    status:"pending"
}) 

if (isAlreadyFollowing) {
    return res.status(200).json({
        message:"You are already Following "+followeeUsername
    })
}

   const followRecords = await followModel.create({
    follower:followerUsername,
    followee:followeeUsername
   })

   res.status(201).json({
    message:`You are following ${followeeUsername}`,
    follow:followRecords
   })

    
}


async function unFollow(req,res){

    const followerUsername = req.user.username

    const followeeUsername = req.params.username

    const isAlreadyFollowing = await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })

    if (followerUsername === followeeUsername) {
        return res.status(400).json({
            message:"You can't Unfollow Yourself maybe in your life you can"
        })
    }



    const doesUserExists = await userModel.findOne({
        username: followeeUsername
    })

    if (!doesUserExists) {
        return res.status(400).json({
            message:"User does not Exists"
        })
    }


    if (!isAlreadyFollowing) {
        return res.status(200).json({
            message:"You are not following "+followeeUsername
        })
    }

    await followModel.findByIdAndDelete(isAlreadyFollowing._id)

    res.status(200).json({
        message:"You Unfollowed "+followeeUsername
    })
}


module.exports = {
    Follow,
    unFollow
}
