import { createContext,useEffect,useState } from "react";
import { getUser } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{


    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    async function hydrateUser() {
      try {
        const response = await getUser();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    hydrateUser();
  }, []);


   if (loading) {
    return <h1>Checking Authentication...</h1>;
  }



    return(
    <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
        {children}
    </AuthContext.Provider>
    )
}