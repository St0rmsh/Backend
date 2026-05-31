import axios from "axios";


export const ApiInstance = axios.create({
    baseURL:"https://api.team-sync.space/api",
    withCredentials: true
})

ApiInstance.interceptors.response.use((response)=>response, 
async(error)=>{

    let originalRequest = error.config;

    if(error.response.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;

        try {
            await ApiInstance.post("/auth/get-accessToken");
            return ApiInstance(originalRequest)
        } catch (error) {
            window.location.href = "/"
            return Promise.reject(error)
        }


        
    }
}
)