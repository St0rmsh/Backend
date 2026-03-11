import React,{useEffect} from 'react'
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from '../components/Nav'


const Feed = () => {
    const {feed,handleFeed,loading,handleLike,handleDislikePost,handleFollow} = usePost()


    if (loading || !feed) {
        return(
            <main><h2>loading...</h2></main>
        )
    }

  return (
    <>
    <main className="h-screen bg-[#3a3a3a] flex justify-center items-center">

  <div className="w-[400px] h-[700px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">

    <div className="h-14 border-b flex items-center justify-center font-semibold ">
      <Nav/>
    </div>

    <div className="flex-1 overflow-y-auto">

      <div className="flex flex-col gap-4 p-4">
        {feed.map((postItem) => {
          return (
            <Post
              key={postItem._id}
              user={postItem.user}
              post={postItem}
              loading={loading}
              handleLike={handleLike}
              handleDislikePost={handleDislikePost}
              handleFollow={handleFollow}
            />
          );
        })}
      </div>

    </div>

  </div>

</main>

    </>
  )
}

export default Feed