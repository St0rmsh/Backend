import Order from "../models/order.model.js";

class OrderDAO {
    async create(orderData) {
        const order = new Order(orderData);
        return await order.save();
    }

    async findById(id) {
        return await Order.findById(id).populate("items.product").populate("user", "fullname email");
    }

    async findByUserId(userId, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Order.find({ user: userId })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("items.product");
    }

    async updateStatus(orderId, orderStatus, paymentStatus) {
        let update = {};
        if (orderStatus) update.orderStatus = orderStatus;
        if (paymentStatus) update.paymentStatus = paymentStatus;
        
        return await Order.findByIdAndUpdate(
            orderId,
            { $set: update },
            { new: true }
        );
    }

    async checkVerifiedPurchase(userId, productId) {
        const order = await Order.findOne({
            user: userId,
            "items.product": productId,
            paymentStatus: "Paid"
        });
        return !!order;
    }

    async findByProductIds(productIds, options = {}) {
        const { sort = { createdAt: -1 }, limit = 10, skip = 0 } = options;
        return await Order.find({ "items.product": { $in: productIds } })
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .populate("items.product")
            .populate("user", "fullname email");
    }
}

export default new OrderDAO();
