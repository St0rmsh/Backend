import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})



export const registerUser = async (userData) => {
    try {
        const response = await api.post("/api/auth/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const loginUser = async (userData) => {
    try {
        const response = await api.post("/api/auth/login", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}