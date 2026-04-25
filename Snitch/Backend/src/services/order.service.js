import orderDao from "../daos/order.dao.js";
import cartDao from "../daos/cart.dao.js";
import productDao from "../daos/product.dao.js";

class OrderService {
    async createOrder(userId, shippingAddress) {
        const cart = await cartDao.findByUserId(userId);
        if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = await productDao.findById(item.product._id);
            if (!product) throw new Error(`Product ${item.product.title} not found`);

            // VALIDATION based on product.type
            if (product.type === "variant_required" && !item.variant) {
                throw new Error(`Variant selection is mandatory for ${product.title}`);
            }

            let price = product.price;
            let stock = product.stock;

            // If product is simple, ignore variant
            const effectiveVariantId = product.type === "simple" ? null : item.variant;

            if (effectiveVariantId) {
                const variant = product.variants.id(effectiveVariantId);
                if (!variant) throw new Error(`Variant for ${product.title} not found`);
                price = variant.price;
                stock = variant.stock;
            } else {
                // Use base product price/stock
                price = product.price;
                stock = product.stock;
            }

            if (item.quantity > stock) {
                throw new Error(`Not enough stock for ${product.title}`);
            }

            const itemTotal = price.amount * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: item.product._id,
                variant: effectiveVariantId,
                quantity: item.quantity,
                priceAtPurchase: price
            });
        }

        // Add shipping and tax (static for now, can be dynamic)
        const shippingFee = 50; 
        const tax = totalAmount * 0.18; // 18% GST
        totalAmount += shippingFee + tax;

        const orderData = {
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentStatus: "Pending",
            orderStatus: "Pending"
        };

        const order = await orderDao.create(orderData);
        
        // Clear cart
        await cartDao.clearCart(userId);

        return order;
    }

    async completePayment(orderId) {
        const order = await orderDao.findById(orderId);
        if (!order) throw new Error("Order not found");
        if (order.paymentStatus === "Paid") return order;

        // Deduct stock
        for (const item of order.items) {
            const product = await productDao.findById(item.product._id);
            if (item.variant) {
                const variant = product.variants.id(item.variant);
                variant.stock -= item.quantity;
            } else {
                product.stock -= item.quantity;
            }
            await product.save();
        }

        return await orderDao.updateStatus(orderId, "Processing", "Paid");
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
