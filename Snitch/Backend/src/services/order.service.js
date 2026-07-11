import orderDao from "../daos/order.dao.js";
import cartDao from "../daos/cart.dao.js";
import productDao from "../daos/product.dao.js";
import { createOrder as createRazorpayOrder, verifyPaymentSignature } from "./razorpay.service.js";

class OrderService {
    async createOrder(userId, shippingAddress) {
        const cart = await cartDao.findByUserId(userId);
        if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

        let subtotal = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const productId = item.product._id ? item.product._id : item.product;
            const product = await productDao.findById(productId);
            if (!product) throw new Error("A product in your cart is no longer available");

            if (product.type === "variant_required" && !item.variant) {
                throw new Error(`Variant selection is mandatory for ${product.title}`);
            }

            const effectiveVariantId = product.type === "simple" ? null : item.variant;
            let price, stock, variantName;

            if (effectiveVariantId) {
                const variant = product.variants.id(effectiveVariantId);
                if (!variant) throw new Error(`Variant for ${product.title} not found`);
                price = variant.price;
                stock = variant.stock;
                variantName = variant.value;
            } else {
                price = product.price;
                stock = product.stock;
                variantName = undefined;
            }

            if (item.quantity > stock) {
                throw new Error(`Not enough stock for ${product.title}`);
            }

            const unitPrice = price.amount; // flat number — matches orderItemSchema.priceAtPurchase
            subtotal += unitPrice * item.quantity;

            orderItems.push({
                product: productId,
                variant: effectiveVariantId,
                productName: product.title,   // now always populated
                variantName,
                quantity: item.quantity,
                priceAtPurchase: unitPrice
            });
        }

        const shippingFee = 50;
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        const totalAmount = Number((subtotal + shippingFee + tax).toFixed(2));

        const order = await orderDao.create({
            user: userId,
            items: orderItems,
            subtotal,             // now included, matches required schema field
            tax,
            shipping: shippingFee,
            totalAmount,
            currency: "INR",
            shippingAddress,
            paymentStatus: "pending",  // lowercase, matches enum
            orderStatus: "pending"
        });

        const razorpayOrder = await createRazorpayOrder({
            amount: totalAmount,
            currency: "INR",
            receipt: order._id.toString()
        });

        const updatedOrder = await orderDao.updateStatus(order._id, undefined, undefined, {
            razorpayOrderId: razorpayOrder.id
        });

        await cartDao.clearCart(userId);

        return { order: updatedOrder, razorpayOrder };
    }

    async _deductStockForOrder(order) {
        for (const item of order.items) {
            const productId = item.product._id || item.product;
            if (item.variant) {
                const updated = await productDao.deductVariantStock(productId, item.variant, item.quantity);
                if (!updated) throw new Error(`Stock unavailable for ${item.productName} (${item.variantName})`);
            } else {
                const updated = await productDao.deductStock(productId, item.quantity);
                if (!updated) throw new Error(`Stock unavailable for ${item.productName}`);
            }
        }
    }

    // Frontend-confirm path — called from the Razorpay checkout.js handler callback
    async completePayment({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
        const order = await orderDao.findById(orderId);
        if (!order) throw new Error("Order not found");
        if (order.paymentStatus === "paid") return order; // idempotent

        const isValid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
        if (!isValid) throw new Error("Payment verification failed");

        await this._deductStockForOrder(order);

        return await orderDao.updateStatus(orderId, "processing", "paid", {
            razorpayOrderId, razorpayPaymentId, razorpaySignature
        });
    }

    // Independent webhook path — Issue 2's second confirmation path
    async completePaymentFromWebhook({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
        const order = await orderDao.findByRazorpayOrderId(razorpayOrderId);
        if (!order) throw new Error("Order not found for webhook event");
        if (order.paymentStatus === "paid") return order; // idempotent — prevents double stock deduction

        await this._deductStockForOrder(order);

        return await orderDao.updateStatus(order._id, "processing", "paid", {
            razorpayPaymentId, razorpaySignature
        });
    }

    async getOrderById(orderId, requestingUser) {
        const order = await orderDao.findById(orderId);
        if (!order) throw new Error("Order not found");

        const isBuyer = order.user._id.toString() === requestingUser._id.toString();
        const isSellerOfSomeItem = order.items.some(item => {
            const product = item.product;
            return product?.seller && product.seller.toString() === requestingUser._id.toString();
        });

        if (!isBuyer && !isSellerOfSomeItem) {
            throw new Error("Unauthorized: you do not have access to this order");
        }

        return order;
    }

    async getUserOrders(userId, options = {}) {
        return await orderDao.findByUserId(userId, options);
    }

    async getSellerOrders(sellerId, options = {}) {
        const products = await productDao.find({ seller: sellerId }, { limit: 1000 });
        const productIds = products.map(p => p._id);
        return await orderDao.findByProductIds(productIds, options);
    }

    async updateOrderStatus(orderId, status, sellerId) {
        const order = await orderDao.findById(orderId);
        if (!order) throw new Error("Order not found");

        const sellsInThisOrder = order.items.some(item => {
            const product = item.product;
            return product?.seller && product.seller.toString() === sellerId.toString();
        });
        if (!sellsInThisOrder) {
            throw new Error("Unauthorized: you do not sell any product in this order");
        }

        return await orderDao.updateStatus(orderId, status);
    }

    async getFrequentlyBoughtTogether(productId) {
        return await orderDao.findFrequentlyBoughtWith(productId, 4);
    }

    async getSellerAnalytics(sellerId) {
        return await orderDao.getSellerAnalytics(sellerId);
    }
}

export default new OrderService();