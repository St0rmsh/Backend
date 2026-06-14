import type { Request, Response } from "express";
import { Likeservice } from "../services/like.service.js";



export const LikeController = async (req:Request<{postId:string}>,res: Response)=>{

    try{


        const userId = req.user?._id
        const postId = req.params.postId

       if (!userId) {
         return res.status(401).json({
            message:"Unauthorized",
            success:false
         })
       }

       const Like = await Likeservice(postId,userId)

       return res.status(200).json({
            message: Like.message,
            success: true,
            data: Like
       })

    }catch(error){
        console.error("Error in like controller:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}