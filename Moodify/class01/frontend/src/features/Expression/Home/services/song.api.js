import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})



export const getSongs = async({mood})=>{

    const response = await  api.get("/api/song?mood=" + mood)
    
    return response.data
}