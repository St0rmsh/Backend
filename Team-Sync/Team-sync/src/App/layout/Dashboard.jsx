import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Asidenav from '../../features/dashboard/UI/Components/Asidenav'
import Topnav from '../../features/dashboard/UI/Components/Topnav'

const Dashboard = () => {

  const {theme} = useSelector((store)=> store.theme)

  useEffect(()=>{
    if(theme === "light"){
      document.documentElement.classList.add("light")
    }else{
      document.documentElement.classList.remove("light")
    }
  },[theme])

  return (
    <div className='h-screen grid grid-cols-[1fr_7fr]'>
        <div className='bg-blue-950 px-6 py-5'>
          <Asidenav/>
        </div>
        <div className='flex flex-col gap-5 p-5'>
          <div className=''><Topnav/></div>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard