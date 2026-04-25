import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'react-router-dom';
import LogoutButton from '../../products/components/LogoutButton';
import { useSelector } from 'react-redux';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const CartItem = ({ item, isDark, updateQuantity, removeFromCart }) => {
    const sym = SYM[item.price?.currency] || '₹';
    const amount = item.price?.amount || 0;
    const [localQty, setLocalQty] = useState(item.quantity);
    const [updating, setUpdating] = useState(false);

    const handleQtyChange = async (newQty) => {
        if (newQty < 1 || newQty > item.stock) return;
        setLocalQty(newQty);
        setUpdating(true);
        try {
            await updateQuantity(item.productId, item.variantId, newQty);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-[#111] border-[#1e1e1e] hover:border-[#333]' : 'bg-white border-[#e5e5df] shadow-sm hover:shadow-xl hover:shadow-black/5'}`}>
            <div className={`w-full sm:w-28 aspect-[3/4] sm:aspect-auto sm:h-36 rounded-2xl overflow-hidden shrink-0 border ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#f0f0ec] bg-[#fafaef]'}`}>
                <img 
                    src={item.variant?.image?.[0]?.url || item.images?.[0]?.url || 'https://placehold.co/600x800?text=No+Image'} 
                    alt={item.productName} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700" 
                />
            </div>
            
            <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                        <Link to={`/products/${item.productId}`} className={`text-lg font-black italic tracking-tighter truncate block hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
                            {item.productName}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.variantName ? (
                                <span className={`text-[9px] font-black px-2 py-1 rounded bg-[#d4a017] text-white uppercase tracking-widest`}>
                                    {item.variantName} Edition
                                </span>
                            ) : (
                                <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase tracking-widest ${isDark ? 'border-[#2a2a2a] text-[#444]' : 'border-[#e5e5df] text-[#aaa]'}`}>
                                    Standard Edition
                                </span>
                            )}
                            <span className={`text-[9px] font-bold uppercase tracking-widest opacity-30`}>{item.category || 'Lifestyle'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                            {sym}{amount.toLocaleString()}
                        </span>
                        <span className={`text-[10px] font-bold opacity-30`}>{sym}{amount.toLocaleString()} per unit</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                    <div className={`flex items-center rounded-2xl border overflow-hidden p-1 transition-all ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-[#fafafa] border-[#e5e5df] shadow-inner'} ${updating ? 'opacity-50' : ''}`}>
                        <button 
                            onClick={() => handleQtyChange(localQty - 1)}
                            disabled={localQty <= 1 || updating}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-75 disabled:opacity-20 ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-white hover:shadow-sm'}`}
                        >
                            −
                        </button>
                        <div className="w-12 text-center">
                            <span className={`text-sm font-black ${updating ? 'animate-pulse' : ''}`}>
                                {localQty}
                            </span>
                        </div>
                        <button 
                            onClick={() => handleQtyChange(localQty + 1)}
                            disabled={localQty >= item.stock || updating}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-75 disabled:opacity-20 ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-white hover:shadow-sm'}`}
                        >
                            +
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {localQty >= item.stock && (
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Max Stock</span>
                        )}
                        <button 
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-red-950/20 text-red-500 border border-red-900/30 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-lg shadow-red-500/20'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartPage = () => {
    const { cartItems, totalPrice, updateQuantity, removeFromCart, cartCount } = useCart();
    const { isDark, toggleTheme } = useTheme();
    const user = useSelector(state => state.auth.user);
    const sym = SYM[cartItems[0]?.price?.currency] || '₹';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-[#f5f5f0] text-[#1a1a1a]'} font-sans`}>
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-[#e0e0db]'}`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
                    <Link to="/products" className="flex items-center gap-2">
                        <span className="text-2xl font-black italic tracking-tighter">SNITCH</span>
                        <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mt-1">SHOPPING CART</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}>
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                            )}
                        </button>
                        {user && (
                            <div className="relative group">
                                <button className={`h-10 px-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? "bg-[#1a1a1a] text-white" : "bg-black text-white shadow-xl"}`}>
                                    {user.fullname?.split(' ')[0]}
                                </button>
                                <div className={`absolute right-0 top-full mt-2 w-48 p-3 rounded-2xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#eee]'}`}>
                                    <LogoutButton />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    <div className="flex-1 space-y-6">
                        <div className="flex items-baseline justify-between mb-8">
                            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Cart</h1>
                            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30">{cartCount} items in your bag</p>
                        </div>

                        {cartItems.length > 0 ? (
                            <>
                                <div className="space-y-6">
                                    {cartItems.map(item => (
                                        <CartItem 
                                            key={`${item.productId}-${item.variantId?._id || item.variantId || 'base'}`} 
                                            item={item} 
                                            isDark={isDark} 
                                            updateQuantity={updateQuantity} 
                                            removeFromCart={removeFromCart} 
                                        />
                                    ))}
                                </div>

                                <div className="pt-8">
                                    <Link 
                                        to="/products"
                                        className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'border-[#1e1e1e] hover:bg-white hover:text-black' : 'border-[#e5e5df] hover:bg-black hover:text-white shadow-lg shadow-black/5'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                        Add More Catches
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className={`p-24 text-center rounded-[40px] border border-dashed transition-all ${isDark ? 'border-[#1e1e1e] bg-[#0e0e0e]' : 'border-[#e5e5df] bg-white shadow-inner'}`}>
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${isDark ? 'bg-[#111]' : 'bg-[#fafaef]'}`}>
                                    <svg className="w-16 h-16 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <h1 className="text-3xl font-black italic mb-4 tracking-tighter">Your bag is empty</h1>
                                <p className={`text-sm mb-12 max-w-sm mx-auto opacity-50`}>Find something you love and make it yours.</p>
                                <Link 
                                    to="/products"
                                    className={`inline-block px-12 py-5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'}`}
                                >
                                    EXPLORE STORE
                                </Link>
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className={`sticky top-24 p-8 rounded-[40px] border transition-all ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-2xl shadow-black/5'}`}>
                                <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-8 opacity-40">Payment Details</h2>
                                
                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Bag Subtotal</span>
                                        <span className="text-lg font-black tracking-tighter">{sym}{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Shipping</span>
                                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Complimentary</span>
                                    </div>
                                    <div className={`border-t pt-6 flex justify-between items-center ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                        <span className="text-xl font-black italic tracking-tighter uppercase">Total</span>
                                        <span className="text-3xl font-black tracking-tighter">{sym}{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link 
                                    to="/payment"
                                    className={`w-full py-5 rounded-[20px] font-black text-[12px] tracking-[0.2em] uppercase text-center block transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'}`}
                                >
                                    PROCEED TO CHECKOUT
                                </Link>
                                
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f4f4ef]'}`}>
                                            <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 20c3.859 2.222 8.141 2.222 12 0l-1.382-14.016z"/></svg>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Authentic Snitch Guaranteed</span>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f4f4ef]'}`}>
                                            <svg className="w-5 h-5 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Secure Encrypted Payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CartPage;
