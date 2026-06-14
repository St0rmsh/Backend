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



export const getAllPostsService = async (userId:string,{page=1,limit=10}:{
    page?:number
    limit?:number
})=>{

    try {
        const skips = (page-1)*limit

        const [posts, totalPosts] = await Promise.all([
            PostModel.find({user:userId}).sort({createdAt:-1}).skip(skips).limit(limit).lean(),
            PostModel.countDocuments({user:userId})  
        ])

        return {
            posts,
            totalPosts,
            currentPage:page,
            totalPages:Math.ceil(totalPosts/limit),
            hasNextPage: page < Math.ceil(totalPosts / limit)
        }

    } catch (error) {
        console.error("Error in get all posts service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}



export const getUserPostsService = async (userId:string,{page=1,limit=10}:{
    page?:number
    limit?:number
})=>{
    try {
        const skips = (page-1)*limit

        const [posts, totalPosts] = await Promise.all([
            PostModel.find({user:userId}).sort({createdAt:-1}).skip(skips).limit(limit).lean(),
            PostModel.countDocuments({user:userId})  
        ])

        return {
            posts,
            totalPosts,
            currentPage:page,
            totalPages:Math.ceil(totalPosts/limit),
            hasNextPage: page < Math.ceil(totalPosts / limit)
        }

    } catch (error) {
        console.error("Error in get all posts service:", error);
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}