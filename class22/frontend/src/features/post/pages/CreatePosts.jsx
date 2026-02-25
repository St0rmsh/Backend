import React, { useState } from 'react'
import { useRef } from 'react'
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const CreatePosts = () => {

    const {loading,handleCreatePost} = usePost()

    const imageFileInputRef = useRef(null)
    const [caption, setcaption] = useState("")

    const navigate = useNavigate()

    function handleSubmit(e){
        e.preventDefault()

        const file = imageFileInputRef.current.files[0]

        handleCreatePost(file,caption)

        navigate("/")
        
    }

    if (loading) {
        return (
            <main><h1>Creating Post</h1></main>
        )
    }


  return (
    <>
    <main className='h-screen bg-[#2a2a2a] flex items-center justify-center'>
        <div className='bg-gray-400 min-h-62.5 flex flex-col justify-evenly px-5 py-3 rounded-sm '>
            <h1 className='text-3xl'>Create Post</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-2' >
                <label className='text-lg bg-white rounded-sm px-3 py-1 captilized cursor-pointer ' htmlFor="imageFile"> Upload Image</label>
                <input ref={imageFileInputRef} hidden type="file" name="imageFile" id="imageFile" />
                <input className='bg-white px-3 py-1.5 outline-none  rounded-sm text-black' onChange={(e)=> setcaption(e.target.value)} type="text" value={caption} name='caption' id='caption' placeholder='Enter Caption' />
                <button className='cursor-pointer bg-red-500 px-2 py-1.5 text-white rounded-sm captilized  '>Create post</button>
            </form>
        </div>
    </main>
    </>
  )
}

export default CreatePosts