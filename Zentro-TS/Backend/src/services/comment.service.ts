import CommentModel from "../model/comment.model.js"
import PostModel from "../model/post.model.js"



export const createCommentService = async (postId:string , userId:string , content:string)=>{

    try {

        const post = await PostModel.findById(postId)

        if(!post){
            throw new Error("Post not found")
        }

        const comment = await CommentModel.create({
            user:userId,
            post:postId,
            content
        })

        await PostModel.findByIdAndUpdate(postId,{
            $inc:{
                commentsCount:1
            }
        })

       await comment.populate("user", "fullname username avatar")
        
        return comment
        
    } catch (error) {
       console.error("Error in Comment service:", error);
        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error"
        );
    }    
}