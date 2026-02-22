import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'


const Login = () => {

    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const {user,loading,handleLogin} = useAuth()
    const navigate = useNavigate()

   async function handleSubmit(e){
        e.preventDefault()

       await handleLogin(username,password)
       console.log("user loggedIn Successfully");
       navigate("/")
    }

    if (loading) {
        return (
            <h2>Loading...</h2>
        )
    }


  return (
    <>
    <main className='h-screen bg-[#3a3a3a] flex items-center justify-center'>
        <div className=' flex flex-col gap-5 bg-gray-700 px-8 py-10 rounded-lg'>
            <h1 className='text-4xl text-white'>Login</h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                <input onInput={(e)=>{setusername(e.target.value)}} className='bg-white text-[#1a1a1a] px-4 py-2 rounded-lg border-none outline-none ' type="text" name='username' placeholder=' Enter Username' />
                <input onInput={(e)=>{setpassword(e.target.value)}} className='bg-white text-[#1a1a1a] px-4 py-2 rounded-lg border-none outline-none ' type="password" name="password" placeholder='Enter Password' />
                <button className='bg-red-500 py-1.5 rounded-lg text-white text-2xl cursor-pointer active:scale-99'>Login</button>
            </form>
            <p className='text-white text-lg'>Don't have an account? <Link className=' text-sky-400' to={"/register"}>register</Link>  </p>
        </div>
    </main>
    </>
  )
}

export default Login