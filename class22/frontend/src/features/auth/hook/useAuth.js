import { AuthContext } from "../auth.context";
import { login,register,getUser } from "../services/auth.api";
import { useContext } from "react";



export const useAuth = ()=>{

    const context = useContext(AuthContext)
    const {user,setuser,loading,setloading} = context


const handlelogin = async(username,password)=>{

    setloading(true)

    try {
        const response = await login(username,password)
    setuser(response.user)

    return response
    } catch (error) {
        console.log(error);
        
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
        console.log(error);
        
    } finally{
           setloading(false)

    }


}

const handleGetUser = async()=>{
    setloading(true)

    try {
        const response = await getUser()
    setuser(response.user)
    } catch (error) {
        
    } finally{
          setloading(false)

    }

}

return{
    user,loading,handlelogin,handleRegister
}

}

