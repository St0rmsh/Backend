import type { Request, Response } from "express";
import type { ICreatePostBody } from "../types/Posts/posts.types.js";
import { createPostService } from "../services/Posts.service.js";
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