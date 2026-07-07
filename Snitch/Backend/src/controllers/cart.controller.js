import cartService from "../services/cart.service.js";

export const getCart = async (req, res) => {
     try {
        const userId = req.user._id;
        const { cart, total, liveItems } = await cartService.getCart(userId);
        res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart,
            total,
            liveItems
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req, res) => {
    try {

        const userId = req.user._id;

        const { productId, variantId, quantity = 1 } = req.body;

        const { cart, total, liveItems } = await cartService.addToCart(userId, productId, variantId, Number(quantity));

        res.status(200).json({
            message: "Item added to cart",
            success: true, 
            cart, 
            total, 
            liveItems 
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(400).json({ message: error.message || "Internal server error" });
    }
};

export const updateCartItem = async (req, res) => {
     try {
        const userId = req.user._id;

        const { productId, variantId } = req.query;

        const { quantity } = req.body;

        const { cart, total, liveItems } = await cartService.updateQuantity(userId, productId, variantId, Number(quantity));

        res.status(200).json({
            message: "Cart updated successfully", 
            success: true, 
            cart, 
            total, 
            liveItems 
        });
        
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(400).json({ message: error.message || "Internal server error" });
    }
};


export const removeFromCart = async (req, res) => {
   try {
        const userId = req.user._id;
        const { productId, variantId } = req.query;
        const { cart, total, liveItems } = await cartService.removeFromCart(userId, productId, variantId);
        res.status(200).json({
            message: "Item removed from cart",
            success: true,
            cart,
            total,
            liveItems
        });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(400).json({ message: error.message || "Internal server error" });
    }
};
