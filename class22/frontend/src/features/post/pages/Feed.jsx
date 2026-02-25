import React,{useEffect} from 'react'
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from '../components/Nav'


const Feed = () => {
    const {feed,handleFeed,loading,handleLike,handleDislikePost} = usePost()

    useEffect(()=>{
        handleFeed()
    },[])

    if (loading || !feed) {
        return(
            <main><h2>loading...</h2></main>
        )
    }

  return (
    <>
    <main className='h-full bg-[#3a3a3a] flex flex-col items-center pt-6'>
        <Nav/>
        <div className="feed min-w-[400px]">
            <div className="posts w-full flex flex-col gap-4">
                {feed.map((postItem)=>{
                   return  <Post key={postItem._id} user={postItem.user} post={postItem} loading={loading} handleLike={handleLike} handleDislikePost={handleDislikePost} />
                })}

            </div>
        </div>
    </main>
    </>
  )
}

export default Feed