import { AuthContext } from "../auth.context";
import { register,login,getMe, } from "../services/auth.api";
import { useContext } from "react";

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
        setL
    }

    return{
        user,loading,handleRegister,handleLogin
    }
}