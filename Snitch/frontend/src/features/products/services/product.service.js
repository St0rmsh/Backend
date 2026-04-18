import axios from "axios";


const productApi = axios.create({
    baseURL: "/api/product",
    withCredentials: true,
})

// ─── SELLER ENDPOINTS ────────────────────────────────────

export const createProduct = async (formData) => {
    const response = await productApi.post("/create", formData);
    return response.data;
}

export const getAllProducts = async () => {
    const response = await productApi.get("/",);
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

// ─── PUBLIC ENDPOINTS (no auth) ──────────────────────────

export const fetchAllPublicProducts = async () => {
    const response = await productApi.get("/all");
    return response.data;
}

export const fetchPublicProductById = async (id) => {
    const response = await productApi.get(`/public/${id}`);
    return response.data;
}

// ─── REVIEW ENDPOINTS ────────────────────────────────────

export const createProductReview = async (id, reviewData) => {
    const response = await productApi.post(`/${id}/reviews`, reviewData);
    return response.data;
}

export const getProductReviews = async (id) => {
    const response = await productApi.get(`/${id}/reviews`);
    return response.data;
}

export const updateReview = async (productId, reviewId, data) => {
    const response = await productApi.put(`/${productId}/reviews/${reviewId}`, data);
    return response.data;
}

export const deleteReview = async (productId, reviewId) => {
    const response = await productApi.delete(`/${productId}/reviews/${reviewId}`);
    return response.data;
}
