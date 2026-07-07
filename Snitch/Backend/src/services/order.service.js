import orderDao from "../daos/order.dao.js";
import cartDao from "../daos/cart.dao.js";
import productDao from "../daos/product.dao.js";
import { createOrder as createRazorpayOrder } from "./razorpay.service.js";

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

            const unitPrice = price.amount; 
            subtotal += unitPrice * item.quantity;

            orderItems.push({
                product: productId,
                variant: effectiveVariantId,
                productName: product.title,    
                variantName,
                quantity: item.quantity,
                priceAtPurchase: unitPrice       
            });
        }

        const shippingFee = 50;
        const tax = Math.round(subtotal * 0.18 * 100) / 100; 
        const totalAmount = subtotal + shippingFee + tax;

        const order = await orderDao.create({
            user: userId,
            items: orderItems,
            subtotal,                
            tax,
            shipping: shippingFee,
            totalAmount,
            currency: "INR",
            shippingAddress,
            paymentStatus: "pending", 
            orderStatus: "pending"    
        });

        const razorpayOrder = await createRazorpayOrder({ amount: totalAmount, currency: "INR" });
        await orderDao.updateStatus(order._id, undefined, undefined, { razorpayOrderId: razorpayOrder.id });

        await cartDao.clearCart(userId);

       return {
            order: { ...order.toObject(), razorpayOrderId: razorpayOrder.id },
            razorpayOrder
        };
    }

    async completePayment(orderId) {
        const order = await orderDao.findById(orderId);
        if (!order) throw new Error("Order not found");
        if (order.paymentStatus === "paid") return order; 

        for (const item of order.items) {
            const product = await productDao.findById(item.product._id || item.product);
            if (item.variant) {
                const variant = product.variants.id(item.variant);
                variant.stock -= item.quantity;
            } else {
                product.stock -= item.quantity;
            }
            await product.save();
        }

        return await orderDao.updateStatus(orderId, "processing", "paid"); 
    }

    async getOrderById(orderId) {
        return await orderDao.findById(orderId);
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
        return await orderDao.updateStatus(orderId, status); 
    }
}

export default new OrderService();