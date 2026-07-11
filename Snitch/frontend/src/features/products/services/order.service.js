import axios from "axios";

const orderApi = axios.create({
    baseURL: "/api/order",
    withCredentials: true,
});

export const createOrder = async (shippingAddress) => {
    const response = await orderApi.post("/create", { shippingAddress });
    return response.data;
};

export const completePayment = async (paymentData) => {
    const response = await orderApi.post("/complete-payment", paymentData);
    return response.data;
};

export const getUserOrders = async (params = {}) => {
    const response = await orderApi.get("/my-orders", { params });
    return response.data;
};

export const getOrderById = async (id) => {
    const response = await orderApi.get(`/${id}`);
    return response.data;
};

export const getSellerOrders = async (params = {}) => {
    const response = await orderApi.get("/seller/orders", { params });
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await orderApi.put(`/${id}/status`, { status });
    return response.data;
};