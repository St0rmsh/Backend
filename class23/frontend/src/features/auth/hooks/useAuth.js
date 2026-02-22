import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,getUser } from "../services/auth.api";


export const useAuth = ()=>{
   
    const context = useContext(AuthContext)

    const{user,setuser,loading,setloading} = context


    const handleLogin = async(username,password)=>{
        setloading(true)

        try {
            const response = await login(username,password)

            setuser(response.user)

            return response
        } catch (error) {

            throw error
            
        } finally{
            setloading(false)
        }
    }

    const handleRegister = async(username,email,password)=>{
         
        setloading(true)

        try {
            const response = await register(username,email,password)
            setuser(response.user)

            return response
        } catch (error) {
            throw error
        } finally{
            setloading(false)
        }
    }



    return {
        user,loading,handleLogin,handleRegister
    }
}