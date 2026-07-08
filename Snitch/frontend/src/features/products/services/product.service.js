import axios from "axios";

const productApi = axios.create({
    baseURL: "/api/product",
    withCredentials: true,
});

const cartApi = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
});

const orderApi = axios.create({
    baseURL: "/api/order",
    withCredentials: true,
});

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
// NOTE: cart items are identified by (productId, variantId) together — there is
// no separate "cart item id" on the backend. variantId must be passed through
// on every call, or the backend defaults it to "BASE" (no variant), which is
// what was causing variant selections to collapse into the base product.

export const addToCart = async (productId, quantity, variantId) => {
    const response = await cartApi.post(`/add`, { productId, variantId, quantity });
    return response.data;
}

export const getCart = async () => {
    const response = await cartApi.get(`/`);
    return response.data;
}

export const updateCartItem = async (productId, variantId, quantity) => {
    const response = await cartApi.put(`/item`, { quantity }, {
        params: { productId, variantId }
    });
    return response.data;
}

export const deleteCartItem = async (productId, variantId) => {
    const response = await cartApi.delete(`/item`, {
        params: { productId, variantId }
    });
    return response.data;
}

// ─── ORDER ENDPOINTS ────────────────────────────────────

export const createOrder = async (shippingAddress) => {
    // NOTE: confirm this matches your current order.routes.js path — you changed
    // it earlier from /checkout to /create; keep this in sync with whichever is live.
    const response = await orderApi.post(`/create`, { shippingAddress });
    return response.data;
}

export const completePayment = async (paymentData) => {
    // paymentData: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }
    const response = await orderApi.post(`/complete-payment`, paymentData);
    return response.data;
}

export const getUserOrders = async () => {
    const response = await orderApi.get(`/my-orders`);
    return response.data;
}

export const getOrderById = async (id) => {
    const response = await orderApi.get(`/${id}`);
    return response.data;
}