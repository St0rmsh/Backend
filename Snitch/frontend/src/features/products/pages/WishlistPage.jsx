import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const WishlistItem = ({ item, isDark, toggleWishlist, addToCart }) => {
    const product = item.product;
    if (!product) return null;

    const sym = SYM[product.price?.currency] || '';
    const amount = product.price?.amount || 0;
    const outOfStock = (product.stock ?? 0) < 1;

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
            <div className={`w-20 h-24 rounded-lg overflow-hidden shrink-0 ${isDark ? 'bg-[#161616]' : 'bg-[#f0f0ec]'}`}>
                <img src={product.images?.[0]?.url} alt={product.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
                <Link to={`/products/${product._id}`} className={`text-sm font-bold truncate block hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
                    {product.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[13px] font-bold ${isDark ? 'text-[#aaa]' : 'text-[#444]'}`}>
                        {sym}{amount.toLocaleString()}
                    </span>
                    {outOfStock && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Out of Stock</span>
                    )}
                </div>
                
                <div className="flex gap-2 mt-3">
                    <button 
                        onClick={() => addToCart(product, 1)}
                        disabled={outOfStock}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-colors disabled:opacity-40 ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-black text-white hover:bg-[#333]'}`}
                    >
                        ADD TO CART
                    </button>
                    <button 
                        onClick={() => toggleWishlist(product._id, item.variant)}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-bold border ${isDark ? 'border-[#333] text-[#666] hover:text-red-500 hover:border-red-500' : 'border-[#ddd] text-[#999] hover:text-red-600 hover:border-red-600'}`}
                    >
                        REMOVE
                    </button>
                </div>
            </div>
        </div>
    );
};

const WishlistPage = () => {
    const { wishlistItems, loading, toggleWishlist } = useWishlist();
    const { isDark, toggleTheme } = useTheme();
    const { addToCart } = useCart();

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

            <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black tracking-tight italic">WISHLIST</h1>
                    <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#444]' : 'text-[#999]'}`}>
                        {wishlistItems.length} ITEM{wishlistItems.length !== 1 ? 'S' : ''}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-32 rounded-xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-white'}`} />
                        ))}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                        {wishlistItems.map(item => (
                            <WishlistItem 
                                key={`${item.product?._id}-${item.variant || 'base'}`} 
                                item={item} 
                                isDark={isDark} 
                                toggleWishlist={toggleWishlist} 
                                addToCart={addToCart} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-white'}`}>
                        <h2 className="text-lg font-bold mb-2">Your wishlist is empty</h2>
                        <p className={`text-sm mb-6 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>Save items you love here.</p>
                        <Link 
                            to="/products"
                            className={`inline-block px-8 py-3 rounded-xl text-sm font-bold transition-colors ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
                        >
                            GO SHOPPING
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default WishlistPage;