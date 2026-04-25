import wishlistService from "../services/wishlist.service.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await wishlistService.getWishlist(userId);
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.body;
        
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const wishlist = await wishlistService.toggleWishlist(userId, productId, variantId || null);
        res.status(200).json({ message: "Wishlist updated", success: true, wishlist });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
