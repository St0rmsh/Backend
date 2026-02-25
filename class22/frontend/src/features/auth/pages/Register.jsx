import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {

    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const {loading,handleRegister} = useAuth()
    const navigate = useNavigate()

    async function handleform(e){
       e.preventDefault()

       await handleRegister(username,email,password)
       navigate("/")
    }

    if (loading) {
      return (
        <main><h1>Loading...</h1></main>
      )
    }

  return (
    <>
     <main className='h-screen bg-[#2a2a2a] flex items-center justify-center'>
       <div className='bg-[#fafafa] px-6 py-4 rounded-sm flex flex-col gap-6'>
        <h1 className='text-[5vw] '>Register</h1>

        <form onSubmit={handleform} className='flex flex-col gap-2'>
            <input onInput={(e)=>{setusername(e.target.value)}} className='bg-gray-300 px-5 py-2 rounded-sm border-none outline:none' type="text" placeholder='Enter Username' id='username' name='username' />
            <input onInput={(e)=>{setemail(e.target.value)}} className='bg-gray-300 px-5 py-2 rounded-sm border-none outline:none' type="email"  placeholder='Enter Password' id='email' name='email' />
            <input onInput={(e)=>{setpassword(e.target.value)}} className='bg-gray-300 px-5 py-2 rounded-sm border-none outline:none' type="password"  placeholder='Enter Password' id='password' name='password' />
            <button className='bg-red-400 text-3xl py-1 px-3 rounded-lg cursor-pointer'>Register</button>
        </form>
        <p>Have an account? <Link className='text-red-500' to="/login">Login</Link> </p>
       </div>
    </main>
    </>
  )
}

export default Register