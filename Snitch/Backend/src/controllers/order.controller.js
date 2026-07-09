import orderService from "../services/order.service.js";

export const checkout = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress } = req.body;
        const { order, razorpayOrder } = await orderService.createOrder(userId, shippingAddress);
        res.status(201).json({
            message: "Order placed successfully. Please complete payment.",
            success: true,
            order,
            razorpayOrder   // frontend needs this for the Razorpay checkout widget — was being dropped before
        });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(400).json({ message: error.message || "Checkout failed" });
    }
};

export const completePayment = async (req, res) => {
    try {
        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const order = await orderService.completePayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature });
        res.status(200).json({ message: "Payment successful. Stock updated.", success: true, order });
    } catch (error) {
        console.error("Payment error:", error);
        res.status(400).json({ message: error.message || "Payment completion failed" });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;
        const orders = await orderService.getUserOrders(userId, { 
            limit: Number(limit), 
            skip: (Number(page) - 1) * Number(limit) 
        });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const sellerId = req.user._id;
        const { id } = req.params;
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(id, status, sellerId);
        res.status(200).json({ message: "Order status updated", success: true, order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
