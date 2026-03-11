const CommentModel = require("../models/comment.model")




async function createComment(req,res){

  const {postId} = req.params
  const user = req.user.id
  const {text} = req.body


  const comment = await CommentModel.create({
    text,
    user:user,
    post:postId
  })

  res.status(201).json({
    message:"Commented on Post",
    comment
  })

}


module.exports = {
    createComment
}