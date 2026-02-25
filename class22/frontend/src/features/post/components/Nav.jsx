import React from 'react'
import { useNavigate } from 'react-router'

const Nav = () => {

    const navigate =  useNavigate()

  return (
    <nav className='bg-red-400 w-[70%] flex justify-between mb-5 rounded-sm py-2 px-4 items-center'>
        <p className='text-xl text-white '>Insta-Clone</p>

        <button onClick={()=>{navigate("/createPost")}} className='text-lg bg-red-600 px-3 py-1 text-white rounded-sm cursor-pointer '>Create Post</button>
    </nav>
  )
}

export default Nav