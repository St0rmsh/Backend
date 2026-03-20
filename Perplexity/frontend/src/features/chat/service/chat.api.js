import axios from "axios"


const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export const sendMessages = async({message,chatId})=>{

   const response = await api.post("/api/chats/message",{
    message,
    chatId
   })

   return response.data
}

export const fetchChats = async()=>{
    const response = await api.get("/api/chats")
    return response.data
}

export const fetchMessage = async(chatId)=>{

    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}