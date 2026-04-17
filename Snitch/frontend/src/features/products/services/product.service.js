import axios from "axios";


const productApi = axios.create({
    baseURL: "/api/product",
    withCredentials: true,
})

export const createProduct = async (formData) => {
    const response = await productApi.post("/create", formData);
    return response.data;
}

export const getAllProducts = async () => {
    const response = await productApi.get("/",);
    console.log("API RESPONSE:", response.data);
    return response.data;
}

export const getProductById = async (id) => {
    const response = await productApi.get(`/${id}`);
    return response.data;
}

export const updateProduct = async (id, data) => {
    const response = await productApi.put(`/${id}`, data);
    return response.data;
}

export const deleteProduct = async (id) => {
    const response = await productApi.delete(`/${id}`);
    return response.data;
}

export const createProductReview = async (id, reviewData) => {
    const response = await productApi.post(`/${id}/reviews`, reviewData);
    return response.data;
}
