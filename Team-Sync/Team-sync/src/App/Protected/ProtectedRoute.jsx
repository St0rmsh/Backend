import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
  const {employee, isLoading} = useSelector((state)=>state.auth)

  if (!employee) {
    return <Navigate to={"/login"} replace/>
  }
  
  return <Outlet/>
}

export default ProtectedRoute