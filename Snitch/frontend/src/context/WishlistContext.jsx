import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const WishlistContext = createContext();

const wishlistApi = axios.create({
    baseURL: '/api/wishlist',
    withCredentials: true
});

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]); // Array of { product: {...}, variant: "id" }
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user);

    const fetchWishlist = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await wishlistApi.get('/');
            if (res.data.success) {
                setWishlistItems(res.data.wishlist.items || []);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [user, fetchWishlist]);

    const toggleWishlist = useCallback(async (productId, variantId = null) => {
        if (!user) {
            return { error: "Please log in to manage your wishlist." };
        }
        try {
            const res = await wishlistApi.post('/toggle', { productId, variantId });
            if (res.data.success) {
                setWishlistItems(res.data.wishlist.items || []);
                return { success: true };
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            return { error: error.response?.data?.message || "Failed to update wishlist" };
        }
    }, [user]);

    const isInWishlist = useCallback((productId, variantId = null) => {
        return wishlistItems.some(item => 
            item.product?._id === productId && 
            (variantId ? item.variant === variantId : !item.variant)
        );
    }, [wishlistItems]);

    return (
        <WishlistContext.Provider value={{ wishlistItems, loading, toggleWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
