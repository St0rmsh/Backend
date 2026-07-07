import Cart from "../models/cart.model.js";
import mongoose from "mongoose";


class CartDAO {

    async findByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("items.product");
    }

    async getCartWithComputedTotal(userId) {

        

    const result = await Cart.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $unwind: { path: "$items" } },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "items.product"
            }
        },
        { $unwind: { path: "$items.product" } },
        { $unwind: { path: "$items.product.variants", preserveNullAndEmptyArrays: true } },
        {
            $match: {
                $expr: {
                    $or: [
                        { $and: [
                            { $eq: ["$items.variant", null] },
                            { $eq: ["$items.product.variants", null] }
                        ]},
                        { $eq: ["$items.variant", "$items.product.variants._id"] }
                    ]
                }
            }
        },
        {
            $addFields: {
                effectivePrice: {
                    $cond: [
                        { $eq: ["$items.variant", null] },
                        "$items.product.price.amount",
                        "$items.product.variants.price.amount"
                    ]
                },
                effectiveStock: {
                    $cond: [
                        { $eq: ["$items.variant", null] },
                        "$items.product.stock",
                        "$items.product.variants.stock"
                    ]
                }
            }
        },
        {
            $addFields: {
                itemPrice: { $multiply: ["$items.quantity", "$effectivePrice"] }
            }
        },
        {
            $group: {
                _id: "$_id",
                total: { $sum: "$itemPrice" },
                items: {
                    $push: {
                        product: "$items.product._id",
                        productName: "$items.product.title",
                        variant: "$items.variant",
                        quantity: "$items.quantity",
                        unitPrice: "$effectivePrice",
                        stockAvailable: "$effectiveStock",
                        itemTotal: "$itemPrice"
                    }
                }
            }
        }
    ], { maxTimeMS: 60000, allowDiskUse: true });

    return result[0] || { _id: userId, total: 0, items: [] };
}

    async create(cartData) {
        const cart = new Cart(cartData);
        return await cart.save();
    }

    async updateByUserId(userId, updateData) {
        return await Cart.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true, upsert: true, runValidators: true }
        ).populate("items.product");
    }

    async clearCart(userId) {
        return await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );
    }
}

export default new CartDAO();
