import {getFeed,createPost,likePost,dislikePost,follow,unFollow} from "../services/poast.api"
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
        setfeed([response.post, ...feed])
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


    const handleFollow = async(username,isFollowing)=>{
        try {

            if (isFollowing) {
                await unFollow(username)
            }else{
                await follow(username)
            }

           setfeed(feed.map(post =>post.user.username === username? { ...post, isFollowing: !isFollowing }:post ))
        } catch (error) {
            console.error(error);
            
        }

    }


   

    useEffect(()=>{
     handleFeed()
    },[])


    return{ post,feed,loading,handleFeed,handleCreatePost,handleLike,handleDislikePost,handleFollow }

}