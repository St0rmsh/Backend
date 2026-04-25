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

export const addProductVariant = async (id, formData) => {
    const response = await productApi.post(`/${id}/variants`, formData);
    return response.data;
}

export const deleteProductVariant = async (id, variantId) => {
    const response = await productApi.delete(`/${id}/variants/${variantId}`);
    return response.data;
}

// ─── PUBLIC ENDPOINTS (no auth) ──────────────────────────

export const fetchAllPublicProducts = async (params = {}) => {
    const response = await productApi.get("/all", { params });
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

export const getProductReviews = async (id, params = {}) => {
    const response = await productApi.get(`/${id}/reviews`, { params });
    return response.data;
}

export const getSellerReviews = async () => {
    const response = await productApi.get(`/seller/reviews`);
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


// ─── CART ENDPOINTS ────────────────────────────────────

export const addToCart = async (productId, quantity, variant) => {
    const response = await productApi.post(`/cart/add`, { productId, quantity, variant });
    return response.data;
}

export const getCart = async () => {
    const response = await productApi.get(`/cart`);
    return response.data;
}

export const updateCartItem = async (itemId, quantity, variant) => {
    const response = await productApi.put(`/cart/item/${itemId}`, { quantity, variant });
    return response.data;
}

export const deleteCartItem = async (itemId) => {
    const response = await productApi.delete(`/cart/item/${itemId}`);
    return response.data;
}

// ─── ORDER ENDPOINTS ────────────────────────────────────

export const createOrder = async (orderData) => {
    const response = await productApi.post(`/order/create`, orderData);
    return response.data;
}

export const getUserOrders = async () => {
    const response = await productApi.get(`/order/my-orders`);
    return response.data;
}
