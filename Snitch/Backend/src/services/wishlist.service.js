import wishlistDao from "../daos/wishlist.dao.js";

class WishlistService {
    async getWishlist(userId) {
        let wishlist = await wishlistDao.findByUserId(userId);
        if (!wishlist) {
            // Create a default empty wishlist for the user
            wishlist = await wishlistDao.addToWishlist(userId, null); 
            // The DAO adds a null item if productId is null, so we clean it up if it's the initialization
            if (wishlist.items.length > 0 && wishlist.items[0].product === null) {
                wishlist.items = [];
                await wishlist.save();
            }
        }
        return wishlist;
    }

    async toggleWishlist(userId, productId, variantId = null) {
        const exists = await wishlistDao.exists(userId, productId, variantId);

        if (exists) {
            return await wishlistDao.removeFromWishlist(userId, productId, variantId);
        } else {
            return await wishlistDao.addToWishlist(userId, productId, variantId);
        }
    }
}

export default new WishlistService();
