import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CartContext = createContext();

const cartApi = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
});

export const CartProvider = ({ children }) => {
    const user = useSelector(state => state.auth.user);
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = useCallback(async () => {
        if (!user) return;
        try {
            const res = await cartApi.get('/');
            if (res.data.success && res.data.cart) {
                const mappedItems = res.data.cart.items.map(item => {
                    const product = item.product;
                    if (!product || typeof product === 'string') {
                        return {
                            productId: item.product.toString(),
                            itemId: item._id.toString(),
                            productName: item.productName || 'Unknown Product',
                            variantName: item.variantName,
                            quantity: item.quantity,
                            price: item.price,
                            stock: 0,
                            images: []
                        };
                    }

                    const variantId = item.variant ? item.variant.toString() : null;
                    const variantDetails = product?.variants?.find(v => v._id && v._id.toString() === variantId);
                    
                    return {
                        ...product,
                        productId: product._id.toString(),
                        variantId: variantId,
                        variant: variantDetails, 
                        productName: item.productName,
                        variantName: item.variantName,
                        quantity: item.quantity,
                        price: item.price,
                        itemId: item._id.toString(),
                        stock: variantDetails ? variantDetails.stock : (product.stock || 0)
                    };
                });
                setCartItems(mappedItems);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user, fetchCart]);

    const addToCart = useCallback(async (product, quantity = 1, variantId = null) => {
        if (!user) {
            alert("Please log in to add items to the cart.");
            return;
        }
        try {
            await cartApi.post('/add', {
                productId: product._id,
                variantId,
                quantity
            });
            await fetchCart();
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert(error.response?.data?.message || "Failed to add to cart");
        }
    }, [user, fetchCart]);

    const removeFromCart = useCallback(async (productId, variantId = null) => {
        if (!user) return;
        const previousItems = [...cartItems];
        setCartItems(prev => prev.filter(item => 
            !(item.productId === productId && (variantId ? item.variantId === variantId : !item.variantId))
        ));

        try {
            const res = await cartApi.delete(`/remove?productId=${productId}${variantId ? `&variantId=${variantId}` : ''}`);
            if (!res.data.success) {
                setCartItems(previousItems);
                alert(res.data.message || "Failed to remove item");
            }
        } catch (error) {
            console.error("Failed to remove from cart", error);
            setCartItems(previousItems);
        }
    }, [user, cartItems]);

    const updateQuantity = useCallback(async (productId, variantId = null, quantity) => {
        if (!user) return;
        const previousItems = [...cartItems];
        setCartItems(prev => prev.map(item => {
            if (item.productId === productId && 
                (variantId ? item.variantId === variantId : !item.variantId)) {
                return { ...item, quantity };
            }
            return item;
        }));

        try {
            const res = await cartApi.put(`/update?productId=${productId}${variantId ? `&variantId=${variantId}` : ''}`, { quantity });
            if (!res.data.success) {
                setCartItems(previousItems);
                alert(res.data.message || "Failed to update quantity");
            }
        } catch (error) {
            console.error("Failed to update quantity", error);
            setCartItems(previousItems);
        }
    }, [user, cartItems]);

    const clearCart = useCallback(() => setCartItems([]), []);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price?.amount || 0) * item.quantity, 0);
    }, [cartItems]);

    const cartCount = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
