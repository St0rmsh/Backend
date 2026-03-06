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
    <main className='min-h-screen bg-[#3a3a3a] flex flex-col items-center pt-6'>
        <Nav/>
        <div className="feed w-full flex justify-center mt-6">
            <div className="posts w-full max-w-[600px] flex flex-col gap-6 px-2">
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