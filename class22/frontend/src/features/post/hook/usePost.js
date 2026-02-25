import {getFeed,createPost,likePost,dislikePost} from "../services/poast.api"
import { useContext, useEffect } from "react"
import { postContext } from "../post.context"




export const usePost = ()=>{

    const context = useContext(postContext)

    const {post,setpost,loading,setloading,feed,setfeed} = context



    const handleFeed = async()=>{
        setloading(true)

        try {
            const response = await getFeed()
            setfeed(response.post)
        } catch (error) {
            throw error
        } finally{
            setloading(false)
        }
    }

    const handleCreatePost = async(imageFile,caption)=>{
       setloading(true)

       try {
        const response = await createPost(imageFile,caption)
        setfeed([response.post],...feed)
       } catch (error) {
        throw error 
       } finally{
        setloading(false)
       }
    }

    const handleLike = async(postId)=>{
        const response = await likePost(postId)
                await handleFeed()

    }

    const handleDislikePost = async(postId)=>{
        const response = await dislikePost(postId)
        await handleFeed()
    }

    useEffect(()=>{
     handleFeed()
    },[])


    return{ post,feed,loading,handleFeed,handleCreatePost,handleLike,handleDislikePost }

}