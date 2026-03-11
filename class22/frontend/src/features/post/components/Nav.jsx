import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {

    const navigate =  useNavigate()

  return (
   <nav className="w-full bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 px-6 py-3 flex items-center justify-between shadow-sm">

  <p className="text-xl font-semibold text-black dark:text-white">
    <Link to="/profile">My Social App</Link>
  </p>

  <button
    onClick={() => navigate("/createPost")}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm transition"
  >
    Create Post
  </button>

</nav>
  )
}

export default Nav