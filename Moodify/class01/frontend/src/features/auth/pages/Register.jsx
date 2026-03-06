import React from 'react'
import { Link } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {

  const { user,loading,handleRegister}  = useAuth()


  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const navigate = useNavigate()


  async function HandleSubmit(e){
    e.preventDefault()

    await handleRegister({username,email,password});
    navigate("/")
  }

  if (loading) {
    return(
      <main><h1>Loading...</h1></main>
    )
  }

  return (
    <main className='h-screen flex items-center'>
      <div className="register flex flex-col gap-6 bg-gray-700 px-20 py-10 rounded-sm">
        <h1>Register</h1>

        <form onSubmit={HandleSubmit} className='flex flex-col gap-2.5'>
          <input onInput={(e)=>{setusername(e.target.value)}} className='px-4 py-2 bg-white text-black rounded-sm ' type="text" placeholder='Enter Username' name='username' id='username' />
          <input onInput={(e)=>{setemail(e.target.value)}} className='px-4 py-2 bg-white text-black rounded-sm' type="email" placeholder='Enter Email' name='email' id='email'/>
          <input onInput={(e)=>{setpassword(e.target.value)}} className='px-4 py-2 bg-white text-black rounded-sm' type="password" placeholder='Enter Password' name='password' id='password' />
          <button>Register</button>
        </form>
        <p>Have an Acoount?  <Link to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register