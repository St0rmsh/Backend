import Wishlist from "../models/wishlist.model.js";

class WishlistDAO {
    async findByUserId(userId) {
        return await Wishlist.findOne({ userId }).populate("items.product");
    }

    async addToWishlist(userId, productId, variantId = null) {
        return await Wishlist.findOneAndUpdate(
            { userId },
            { $addToSet: { items: { product: productId, variant: variantId } } },
            { new: true, upsert: true }
        ).populate("items.product");
    }

    async removeFromWishlist(userId, productId, variantId = null) {
        return await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { product: productId, variant: variantId } } },
            { new: true }
        ).populate("items.product");
    }

    // New helper to check existence including variantId
    async exists(userId, productId, variantId = null) {
        return await Wishlist.findOne({
            userId,
            items: { $elemMatch: { product: productId, variant: variantId } }
        });
    }
}

export default new WishlistDAO();
