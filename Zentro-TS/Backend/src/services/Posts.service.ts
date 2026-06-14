import PostModel from "../model/post.model.js";
import type { ICreatePostBody } from "../types/Posts/posts.types.js";



export const createPostService = async (userId:string,{title,content,tags,category,coverImage}:ICreatePostBody)=>{
    try {
        

        const post = await PostModel.create({
            user: userId,
            title,
            content,
            ...(tags && { tags }),
            ...(category && { category }),
            ...(coverImage && { coverImage }),
        });


        return post

    } catch (error) {
        console.error("Error in post service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }

}