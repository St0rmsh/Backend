import { useDispatch } from "react-redux";
import { setUser, setLoading,  setError } from "../auth.slice"
import { Login,GetUser,Register } from "../services/auth.api";


export const useAuth = ()=>{
   const dispatch = useDispatch()


   async function handleRegisteruser({username,email,password}){
    try {
        dispatch(setLoading(true))

        const data = await Register({username,email,password})
        
    } catch (error) {
        dispatch(setError(error.response.data.message || "Registration Failed"))
    } finally {
        dispatch(setLoading(false))
    }
   }


   async function handleLoginUser({email,password}){
    try {
        dispatch(setLoading(true))

        const data = await Login({email,password})
        dispatch(setUser(data.user))
    } catch (error){
        dispatch(setError(error.response.data.message || "Login Failed"))
    } finally {
        dispatch(setLoading(false))
    }
   }



   async function getUser(){
    try{
        setLoading(true)
        const data = await GetUser()

        dispatch(setUser(data.user))
    } catch(error){
        dispatch(setError(error.response.data.message))
    } finally {
        dispatch(setLoading(false))
    }
   }

   return {
    handleLoginUser,
    getUser,
    handleRegisteruser
   }
}
