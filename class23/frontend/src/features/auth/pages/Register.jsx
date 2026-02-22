import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'


const Register = () => {

    const {user,loading,handleRegister} = useAuth()

    const [username, setusername] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(e){
       e.preventDefault()

       await handleRegister(username,email,password)
       console.log("user registered Successfully");

       
    }

    if (loading) {
        return(
            <h2>Loading...</h2>
        )
    }

  return (
    <>
     <main className='h-screen bg-[#3a3a3a] flex items-center justify-center'>
            <div className=' flex flex-col gap-5 bg-gray-700 px-14 py-10 rounded-lg'>
                <h1 className='text-4xl text-white'>Register</h1>
    
                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                    <input onInput={(e)=>{setusername(e.target.value)}} className='bg-white text-[#1a1a1a] px-5 py-2 rounded-lg border-none outline-none ' type="text" name='username' placeholder=' Enter Username' />
                    <input onInput={(e)=>{setemail(e.target.value)}} className='bg-white text-[#1a1a1a] px-5 py-2 rounded-lg border-none outline-none ' type="email" name="email" placeholder='Enter Email' />
                    <input onInput={(e)=>{setpassword(e.target.value)}} className='bg-white text-[#1a1a1a] px-5 py-2 rounded-lg border-none outline-none ' type="password" name="password" placeholder='Enter Password' />
                    <button className='bg-red-500 py-1.5 rounded-lg text-white text-2xl cursor-pointer active:scale-99'>register</button>
                </form>
                <p className='text-white text-lg'> have an account? <Link className=' text-sky-400' to={"/login"}>login</Link>  </p>
            </div>
        </main>
    </>
  )
}

export default Register