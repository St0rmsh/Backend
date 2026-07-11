import { useState, useCallback } from "react";
import {
    createOrder,
    completePayment,
    getUserOrders,
    getOrderById,
    getSellerOrders,
    updateOrderStatus,
    getFrequentlyBoughtTogether,
    getSellerAnalytics,
} from "../services/order.service";

export const useOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateOrder = useCallback(async (shippingAddress) => {
        setLoading(true);
        setError(null);
        try {
            const data = await createOrder(shippingAddress);
            return data;
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCompletePayment = useCallback(async (paymentData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await completePayment(paymentData);
            return data;
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetUserOrders = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserOrders(params);
            return data.orders || [];
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetOrderById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrderById(id);
            return data.order;
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetSellerOrders = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSellerOrders(params);
            return data.orders || [];
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdateOrderStatus = useCallback(async (id, status) => {
        setLoading(true);
        setError(null);
        try {
            const data = await updateOrderStatus(id, status);
            return data.order;
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGetFrequentlyBoughtTogether = useCallback(async (productId) => {
        try {
            const data = await getFrequentlyBoughtTogether(productId);
            return data.suggestions || [];
        } catch (err) {
            console.error("Frequently bought together fetch failed", err);
            return [];
        }
    }, []);

    const handleGetSellerAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSellerAnalytics();
            return data.analytics;
        } catch (err) {
            const formatted = { message: err.response?.data?.message || err.message, status: err.response?.status };
            setError(formatted);
            throw formatted;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        handleCreateOrder,
        handleCompletePayment,
        handleGetUserOrders,
        handleGetOrderById,
        handleGetSellerOrders,
        handleUpdateOrderStatus,
        handleGetFrequentlyBoughtTogether,
        handleGetSellerAnalytics,
    };
};