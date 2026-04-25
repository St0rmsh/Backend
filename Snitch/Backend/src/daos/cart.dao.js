import Cart from "../models/cart.model.js";

class CartDAO {
    async findByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate("items.product");
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
