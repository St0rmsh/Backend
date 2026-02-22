import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'


const Login = () => {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const navigate = useNavigate()

  const {user,loading,handlelogin} = useAuth()

 async function handleSubmit(e){
    e.preventDefault()


    await handlelogin(username,password)

    console.log("User LoggedIn Successfully");
    navigate("/")
    
  }

  if (loading) {
    return (
        <main>
            <h1>Loading...</h1>
        </main>
    )
  }


  return (
    <>
    <main className='h-screen bg-[#2a2a2a] flex items-center justify-center'>
       <div className='bg-[#fafafa] px-6 py-4 rounded-sm flex flex-col gap-6'>
        <h1 className='text-[5vw] '>Login</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2.5'>
            <input onInput={(e)=>{setusername(e.target.value)}} className='bg-gray-300 px-5 py-2 rounded-sm border-none outline:none' type="text" placeholder='Enter Username' id='username' name='username' />
            <input onInput={(e)=>{setpassword(e.target.value)}} className='bg-gray-300 px-5 py-2 rounded-sm border-none outline:none' type="password"  placeholder='Enter Password' id='password' name='password' />
            <button className='bg-red-400 text-3xl py-1 px-3 rounded-lg cursor-pointer'>Login</button>
        </form>
        <p>Don't have an account? <Link className='text-red-500' to="/register">register</Link> </p>
       </div>
    </main>
    </>
  )
}

export default Login