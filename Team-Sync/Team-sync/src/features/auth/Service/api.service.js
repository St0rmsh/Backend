import axios from "axios";


const authApi = axios.create({
    baseURL:"/api/auth",
    withCredentials:true
})


export const registerUser = async (data)=>{
    try {
        const response = await authApi.post("/register",data)
        console.log(response.data);
        return response.data  
    } catch (error) {
        throw new Error(error.response?.data?.message) || "Registeration Failed"
    }
}


export const loginuser = async(data)=>{
    try {
        const response = await authApi.post("/login",data)
        console.log(response.data);
        return response.data
        
    } catch (error) {
        throw new Error(error.response?.data?.message) || "Login failed"
        
    }
}