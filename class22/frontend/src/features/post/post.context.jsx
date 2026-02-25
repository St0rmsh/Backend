import { createContext,useState } from "react";




export const postContext = createContext()


export const PostContextProvider = ({children})=>{

    const [post, setpost] = useState(null)
    const [loading, setloading] = useState(false)
    const [feed, setfeed] = useState([])


    return(
        <postContext.Provider value={{post,setpost,loading,setloading,feed,setfeed}}>
            {children}
        </postContext.Provider>
    )

}