import { createContext,useEffect,useState } from "react";
import { getUser } from "./services/auth.api";

export const AuthContext = createContext()


export const AuthProvider = ({children})=>{
  
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)


    useEffect(() => {
    async function HydrateUser() {
        
        try {
            const response = await getUser()

            setuser(response.user)
        } catch (error) {
            console.log(error);
            
        } finally{
            setloading(false)
        }
    }

    HydrateUser()
    
      
    }, [])
    

    return(
        <AuthContext.Provider value={{user,setuser,loading,setloading}}>
            {children}
        </AuthContext.Provider>
    )
}