import type { Request, Response } from "express"
import { createCommentService } from "../services/comment.service.js"


export const commentController = async (req:Request<{postId:string}>,res:Response)=>{
    try {

        const userId = req.user?._id
        const postId = req.params.postId
        const content = req.body.content

        if(!userId){
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        if (!postId) {
            return res.status(400).json({
            success: false,
            message: "Post ID is required"
            });
        }

        if (!content?.trim()) {
             return res.status(400).json({
            success: false,
           message: "Comment content is required"
            });
        }
        
        const comment = await createCommentService(postId,userId,content)

        return res.status(201).json({
            message: "Comment created successfully",
            success: true,
            data: comment
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error"
    });
    }
}