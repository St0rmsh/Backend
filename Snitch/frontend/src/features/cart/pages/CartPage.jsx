import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const CartItem = ({ item, isDark, updateQuantity, removeFromCart }) => {
    const sym = SYM[item.price?.currency] || '';
    const amount = item.price?.amount || 0;

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
            <div className={`w-20 h-24 rounded-lg overflow-hidden shrink-0 ${isDark ? 'bg-[#161616]' : 'bg-[#f0f0ec]'}`}>
                <img src={item.images?.[0]?.url} alt={item.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className={`text-sm font-bold truncate block hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
                    {item.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[13px] font-bold ${isDark ? 'text-[#aaa]' : 'text-[#444]'}`}>
                        {sym}{amount.toLocaleString()}
                    </span>
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                    <div className={`flex items-center border rounded-lg overflow-hidden ${isDark ? 'border-[#2a2a2a]' : 'border-[#ddd]'}`}>
                        <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className={`px-2.5 py-1 text-xs font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5ef]'}`}
                        >
                            −
                        </button>
                        <span className={`px-3 py-1 text-xs font-bold border-x ${isDark ? 'border-[#2a2a2a]' : 'border-[#ddd]'}`}>
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className={`px-2.5 py-1 text-xs font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5ef]'}`}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => removeFromCart(item._id)}
                className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-red-900/40 text-red-500 hover:bg-red-950/20' : 'border-red-100 text-red-600 hover:bg-red-50'}`}
                title="Remove item"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
    const { isDark, toggleTheme } = useTheme();

    // Assuming currency is consistent or from the first item
    const currency = cartItems[0]?.price?.currency || 'INR';
    const sym = SYM[currency] || '';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-[#f4f4ef] text-[#1a1a1a]'} font-sans`}>
            
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1e1e1e]' : 'bg-[#f4f4ef]/95 border-[#ddd]'}`}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link to="/products" className="text-xl font-black italic tracking-[-0.04em]">SNITCH</Link>
                    <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}>
                        {isDark ? (
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        ) : (
                            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                        )}
                    </button>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Items List */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-black tracking-tight italic">YOUR CART</h1>
                            <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#444]' : 'text-[#999]'}`}>
                                {cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''}
                            </span>
                        </div>

                        {cartItems.length > 0 ? (
                            <>
                                {cartItems.map(item => (
                                    <CartItem 
                                        key={item._id} 
                                        item={item} 
                                        isDark={isDark} 
                                        updateQuantity={updateQuantity} 
                                        removeFromCart={removeFromCart} 
                                    />
                                ))}

                                <div className="pt-4 flex justify-start">
                                    <Link 
                                        to="/products"
                                        className={`flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70 ${isDark ? 'text-white' : 'text-black'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        ADD MORE PRODUCTS
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-white'}`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-[#111]' : 'bg-[#fafaef]'}`}>
                                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h1 className="text-lg font-bold mb-2">Your cart is empty</h1>
                                <p className={`text-sm mb-6 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>Looks like you haven't added anything yet.</p>
                                <Link 
                                    to="/products"
                                    className={`inline-block px-8 py-3 rounded-xl text-sm font-bold transition-colors ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
                                >
                                    START SHOPPING
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    {cartItems.length > 0 && (
                        <div className="w-full lg:w-[35%] shrink-0">
                            <div className={`sticky top-20 p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                                <h2 className="text-[13px] font-black uppercase tracking-[0.1em] mb-6 opacity-40">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-60">Subtotal</span>
                                        <span className="font-bold">{sym}{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-60">Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                                    </div>
                                    <div className={`border-t pt-4 flex justify-between ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                        <span className="text-lg font-bold tracking-tight">Total</span>
                                        <span className="text-xl font-black">{sym}{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link 
                                    to="/payment"
                                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest text-center block transition-transform active:scale-[0.98] ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#111] text-white hover:bg-[#333]'}`}
                                >
                                    BUY NOW
                                </Link>
                                
                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f4f4ef]'}`}>
                                            <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 20c3.859 2.222 8.141 2.222 12 0l-1.382-14.016z"/></svg>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-30">100% SECURE CHECKOUT</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f4f4ef]'}`}>
                                            <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"/></svg>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-30">7-DAY EASY RETURNS</span>
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
