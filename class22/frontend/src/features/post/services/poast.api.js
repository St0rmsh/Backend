import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true
})


export const getFeed = async()=>{

    const response = await api.get("/post/feed")

    return response.data
}


export const createPost = async(imageFile,caption)=>{
    
    const formData = new FormData()

    formData.append("imgUrl",imageFile)
    formData.append("caption",caption)


    const response = await api.post("/post",formData)

    return response.data
} 


export const likePost = async(postId)=>{

    const response = await api.post("/post/like/"+postId)

    return response.data
}

export const dislikePost = async(postId)=>{
    const response = await api.post("/post/dislike/"+postId)
    return response.data
}

export const follow = async(username)=>{
    const response = await api.post("/user/follow/"+username)
    return response.data
}


export const unFollow = async(username)=>{
    const response = await api.post("/user/unfollow/"+username)
    return response.data
}