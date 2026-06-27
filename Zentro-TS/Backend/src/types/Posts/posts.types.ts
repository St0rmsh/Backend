import type { Types } from "mongoose";

export interface IPost {
    _id: string,
    user: Types.ObjectId,
    title: string,
    content: string,
    coverImage?: string,
    tags: string[],
    category: string,

    likesCount: number,
    commentsCount: number,
    viewsCount: number,
    isPublished: boolean,

    createdAt?: Date,
    updatedAt?: Date,
}


export interface ICreatePostBody {
    title: string,
    content: string,
    coverImage?: string | undefined,
    tags?: string[] | undefined,
    category?: string | undefined,
}

export interface IPostUpdateBody {
    title?: string,
    content?: string,
    coverImage?: string,
    tags?: string[],
    category?: string,
    isPublished?: boolean,
}



export interface ISearchQuery {
    q?:string,
    category?:string,
    tag?:string,
    page?:number,
    limit?:number

}