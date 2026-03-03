import React from 'react'
import { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { Link, useNavigate } from 'react-router'


const Login = () => {

  const {user,loading,handleLogin} = useAuth()

  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")

  const navigate = useNavigate()



  async function HandleSubmit(e) {
    e.preventDefault()

    await handleLogin(username,password)
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
        <h1>Login</h1>

        <form onSubmit={HandleSubmit} className='flex flex-col gap-2.5'>
          <input onInput={(e)=>{setusername(e.target.value)}} className='px-4 py-2 bg-white text-black rounded-sm ' type="text" placeholder='Enter Username' name='username' id='username' />
          <input onInput={(e)=>{setpassword(e.target.value)}} className='px-4 py-2 bg-white text-black rounded-sm' type="password" placeholder='Enter Password' name='password' id='password' />
          <button>Login</button>
        </form>
        <p>Have an Acoount?  <Link to="/register">Register</Link></p>
      </div>
    </main>
  )
}

export default Login