import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import { useSelector } from 'react-redux';
import LogoutButton from '../../products/components/LogoutButton';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const WishlistPage = () => {
    const { wishlistItems, toggleWishlist, loading } = useWishlist();
    const { isDark, toggleTheme } = useTheme();
    const user = useSelector(state => state.auth.user);
    const { addToCart, cartCount } = useCart();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-[#f5f5f0] text-[#1a1a1a]'} font-sans`}>
            
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-[#e0e0db]'}`}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
                    <Link to="/products" className="flex items-center gap-2">
                        <span className="text-2xl font-black italic tracking-tighter">Shopstream</span>
                        <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mt-1">WISHLIST</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}>
                            {isDark ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
                            )}
                        </button>
                        <Link to="/cart" className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors relative ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-current">{cartCount}</span>}
                        </Link>
                        {user ? (
                            <div className="relative group">
                                <button className={`h-10 px-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? "bg-[#1a1a1a] text-white" : "bg-black text-white shadow-xl"}`}>
                                    {user.fullname?.split(' ')[0]}
                                </button>
                                <div className={`absolute right-0 top-full mt-2 w-48 p-3 rounded-2xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#eee]'}`}>
                                    <LogoutButton />
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-bold">Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
                    <h1 className="text-4xl font-black italic tracking-tighter">MY WISHLIST</h1>
                    <p className={`text-xs font-bold uppercase tracking-[0.3em] opacity-30`}>
                        {wishlistItems.length} curated item{wishlistItems.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center animate-pulse opacity-50">Loading wishlist...</div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map(item => {
                            const product = item.product;
                            if (!product) return null;

                            // Handle variants
                            const variantId = item.variant;
                            const variant = product.variants?.find(v => v._id === variantId);
                            
                            const sym = SYM[variant?.price?.currency || product.price?.currency] || '₹';
                            const amount = variant?.price?.amount || product.price?.amount;
                            const displayImg = variant?.image?.[0]?.url || product.images?.[0]?.url || 'https://placehold.co/600x800?text=No+Image';
                            
                            return (
                                <div key={`${product._id}-${variantId}`} className="group flex flex-col h-full bg-transparent">
                                    <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden border transition-all duration-500 
                                        ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e] group-hover:border-[#d4a017]/30' : 'bg-white border-[#e5e5df] group-hover:border-[#111]'}`}>
                                        
                                        <Link to={`/products/${product._id}`} className="absolute inset-0">
                                            <img src={displayImg} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </Link>

                                        <button 
                                            onClick={() => toggleWishlist(product._id, variantId)}
                                            className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-red-500 text-white shadow-xl scale-100 group-hover:scale-110`}
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>

                                        {variant && (
                                            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                                                <span className="px-2.5 py-1 rounded bg-[#d4a017] text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                    {variant.value} Edition
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pt-5 flex-1 flex flex-col">
                                        <Link to={`/products/${product._id}`} className={`text-lg font-black tracking-tight mb-1 hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
                                            {product.title}
                                        </Link>
                                        
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-sm font-bold opacity-50">{sym}{amount?.toLocaleString()}</span>
                                            <div className="h-3 w-[1px] bg-current opacity-10" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">{product.category || 'Lifestyle'}</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => addToCart(product, 1, variantId)}
                                            className={`mt-auto w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/5' : 'bg-black text-white hover:bg-gray-800 shadow-black/5'}`}
                                        >
                                            MOVE TO CART
                                        </button>
                                      
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={`p-24 text-center rounded-[40px] border border-dashed transition-all ${isDark ? 'border-[#1e1e1e] bg-[#0e0e0e]' : 'border-[#e5e5df] bg-white shadow-inner'}`}>
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${isDark ? 'bg-[#111]' : 'bg-[#fafaef]'}`}>
                            <svg className="w-16 h-16 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black italic mb-4 tracking-tighter">Your wishlist is empty</h2>
                        <p className={`text-sm mb-12 max-w-sm mx-auto opacity-50`}>Save your favorite editions here and grab them before they're gone forever.</p>
                        <Link 
                            to="/products"
                            className={`inline-block px-12 py-5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1 ${isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'}`}
                        >
                            EXPLORE CATCHES
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WishlistPage;
