import type { Request, Response } from "express";
import type { ICreatePostBody } from "../types/Posts/posts.types.js";
import { createPostService, getAllPostsService, getUserPostsService } from "../services/Posts.service.js";
import { uploadBuffer } from "../config/storage.js";


export const createPostController = async (req:Request, res: Response) => {


    try {

        const userId = req.user?._id 
        const {title,content,tags,category} = req.body as ICreatePostBody

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if(!title||!content){
            return res.status(400).json({
                success:false,
                message:"Title and content are required"
            })
        }

        let coverImage :string|undefined
        if(req.file){
            const uploadImage = await uploadBuffer({
                buffer:req.file.buffer,
                fileName:req.file.originalname,
                folder:"Zentro/posts"
            })

            coverImage = uploadImage.url
        }

        const postData: ICreatePostBody = {title,content,
            ...(tags && { tags }),
            ...(category && { category }),
            ...(coverImage && { coverImage }),
        };

        const posts = await createPostService(userId,postData)

        return res.status(201).json({
            success:true,
            message:"Post created successfully",
            data:posts
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error instanceof Error ? error.message : "Internal server error"
        });
    }
}


export const getALLPostsController = async(req:Request,res:Response)=>{

    try {

        const userId = req.user?._id 
        const {page,limit} = req.query

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await getAllPostsService(userId,{
            page:Number(page) || 1,
            limit:Number(limit) || 10
        })

        return res.status(200).json({
            success:true,
            message:"Posts fetched successfully",
            ...result
        })

        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error instanceof Error ? error.message : "Internal server error"
        })
    }
}



export const getUserPostsController = async(req:Request<{userId:string}>,res:Response)=>{
    try {
        const {userId} = req.params
        const {page,limit} = req.query

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const result = await getUserPostsService(userId,{
            page:Number(page) || 1,
            limit:Number(limit) || 10
        })

        return res.status(200).json({
            success:true,
            message:"Posts fetched successfully",
            ...result
        })

        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error instanceof Error ? error.message : "Internal server error"
        })
    }
}