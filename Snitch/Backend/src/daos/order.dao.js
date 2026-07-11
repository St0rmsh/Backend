import Order from "../models/order.model.js";
import mongoose from "mongoose";

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

    async updateStatus(orderId, orderStatus, paymentStatus, extra = {}) {
        let update = { ...extra };
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
            paymentStatus: "paid"
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

    async findByRazorpayOrderId(razorpayOrderId) {
        return await Order.findOne({ razorpayOrderId });
    }

    async findFrequentlyBoughtWith(productId, limit = 4) {
        const objectId = new mongoose.Types.ObjectId(productId);

        const pipeline = [
            { $match: { paymentStatus: "paid", "items.product": objectId } },
            { $unwind: "$items" },
            { $match: { "items.product": { $ne: objectId } } },
            {
                $group: {
                    _id: "$items.product",
                    coOccurrence: { $sum: 1 }
                }
            },
            { $sort: { coOccurrence: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDoc"
                }
            },
            { $unwind: "$productDoc" },
            { $replaceRoot: { newRoot: "$productDoc" } }
        ];

        return await Order.aggregate(pipeline);
    }


    async getSellerAnalytics(sellerId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const pipeline = [
            { $match: { paymentStatus: "paid" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productDoc"
                }
            },
            { $unwind: "$productDoc" },
            { $match: { "productDoc.seller": new mongoose.Types.ObjectId(sellerId) } },
            {
                $addFields: {
                    lineRevenue: { $multiply: ["$items.priceAtPurchase", "$items.quantity"] }
                }
            },
            {
                $facet: {
                    weekRevenue: [
                        { $match: { createdAt: { $gte: startOfWeek } } },
                        { $group: { _id: null, total: { $sum: "$lineRevenue" }, orders: { $addToSet: "$_id" } } }
                    ],
                    monthRevenue: [
                        { $match: { createdAt: { $gte: startOfMonth } } },
                        { $group: { _id: null, total: { $sum: "$lineRevenue" }, orders: { $addToSet: "$_id" } } }
                    ],
                    topProducts: [
                        {
                            $group: {
                                _id: "$items.product",
                                title: { $first: "$items.productName" },
                                unitsSold: { $sum: "$items.quantity" },
                                revenue: { $sum: "$lineRevenue" }
                            }
                        },
                        { $sort: { unitsSold: -1 } },
                        { $limit: 5 }
                    ],
                    allTimeRevenue: [
                        { $group: { _id: null, total: { $sum: "$lineRevenue" } } }
                    ]
                }
            }
        ];

        const [result] = await Order.aggregate(pipeline);

        return {
            weekRevenue: result.weekRevenue[0]?.total || 0,
            weekOrders: result.weekRevenue[0]?.orders?.length || 0,
            monthRevenue: result.monthRevenue[0]?.total || 0,
            monthOrders: result.monthRevenue[0]?.orders?.length || 0,
            allTimeRevenue: result.allTimeRevenue[0]?.total || 0,
            topProducts: result.topProducts || []
        };
    }
}

export default new OrderDAO();
