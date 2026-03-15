import React from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hook/useChat'
import { useEffect } from 'react'

const DashBoard = () => {

    const chat = useChat()

    useEffect(()=>{
        chat.initializeSocket()
    },[])
    const user = useSelector((state)=>state.auth.user)
    console.log(user);
    
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard