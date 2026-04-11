import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export const registerUser = async ({ fullname, email, password, contact }) => {
    try {
        const response = await api.post('/register', { fullname, email, password, contact });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/getMe');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
};

export const completeProfile = async ({ contact, role }) => {
    try {
        const response = await api.put('/complete-profile', { contact, role });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Profile completion failed');
    }
};
