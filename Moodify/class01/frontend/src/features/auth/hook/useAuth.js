import { AuthContext } from "../auth.context";
import { register,login,getUser,logout } from "../services/auth.api";
import { useContext, useEffect } from "react";

export const useAuth = ()=>{

    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading}  = context


    const handleRegister = async({username,email,password})=>{
      
        setLoading(true)

        try {
            const response = await register({username,email,password})

            setUser(response.user);
            
        } catch (error) {
            console.log(error);
            
        } finally{
            setLoading(false)
        }
    }


    const handleLogin = async({username,password})=>{


        setLoading(true)

        try {
            const response = await login({username,password})
            setUser(response.user)
        } catch (error) {
            console.log(error);
            
        } finally{
            setLoading(false)
        }
    }

    const handleGetUser = async()=>{
        setLoading(true)

        try {
            const response = await getUser()
            setUser(response.user)
        } catch (error) {
            console.log(error);
            
        } finally{
            setLoading(false)
        }
    }

     const handleLogout = async()=>{
        setLoading(true)

        try {
            const response = await logout()
            setUser(null)
        } catch (error) {
            console.log(error);
            
        } finally{
            setLoading(false)
        }
    }


    return{
        user,loading,handleRegister,handleLogin,handleGetUser,handleLogout
    }
}