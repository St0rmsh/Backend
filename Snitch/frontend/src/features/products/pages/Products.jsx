import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';
import SearchSort from '../components/SearchSort';
import LogoutButton from '../components/LogoutButton';
import { useWishlist } from '../../../context/WishlistContext';
import Skeleton from '../components/ui/Skeleton';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const ProductCard = memo(({ product, isDark, addToCart }) => {
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product?._id);

  if (!product) return null;

  const images  = product.images || [];
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  const defaultImg = images[0]?.url || 'https://placehold.co/600x800?text=No+Image';
  const secondaryImg = images[1]?.url || defaultImg;
  
  const sym    = SYM[product.price?.currency] || '₹';
  const amount = product.price?.amount;
  const rating = product.averageRating || 0;
  const count  = product.numReviews || 0;

  let minPrice = amount;
  let maxPrice = amount;
  if (hasVariants) {
    variants.forEach(v => {
      const vPrice = v.price?.amount;
      if (vPrice < minPrice) minPrice = vPrice;
      if (vPrice > maxPrice) maxPrice = vPrice;
    });
  }

  return (
    <div className="relative group flex flex-col h-full bg-transparent">
      <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300 
        ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e] group-hover:border-[#d4a017]/50' : 'bg-[#fafaf8] border-[#e5e5df] group-hover:border-[#111]'}`}>
        
        <Link to={`/products/${product._id}`} 
              onMouseEnter={() => setHovering(true)} 
              onMouseLeave={() => setHovering(false)}
              className="absolute inset-0">
          {!loaded && <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0ec]'}`} />}
          <img
            src={hovering ? secondaryImg : defaultImg}
            alt={product.title}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'} ${hovering ? 'scale-110' : 'scale-100'}`}
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md
            ${isWishlisted ? 'bg-red-500 text-white shadow-lg' : (isDark ? 'bg-black/40 text-white hover:bg-black/60' : 'bg-white/80 text-black hover:bg-white')}`}
        >
          <svg className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick Labels */}
        {hasVariants && (
          <div className="absolute bottom-3 left-3 flex gap-2 z-10 pointer-events-none">
            <span className={`text-[9px] font-black px-2 py-1 rounded bg-black/70 text-white uppercase tracking-widest backdrop-blur-sm border border-white/10`}>
              {variants.length} Editions
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          {count > 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#2d6a4f] text-white flex items-center gap-0.5">
                {rating.toFixed(1)} <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </span>
              <span className={`text-[10px] font-bold ${isDark ? 'text-[#444]' : 'text-[#999]'}`}>({count})</span>
            </div>
          ) : (
            <span className={`text-[9px] font-bold uppercase tracking-widest opacity-20 ${isDark ? 'text-[#444]' : 'text-[#999]'}`}>New Catch</span>
          )}
        </div>

          <Link to={`/products/${product._id}`} className={`text-sm font-bold truncate block mb-1 group-hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
          {product.title}
        </Link>
        
        <p className={`text-[11px] line-clamp-1 mb-2 opacity-50 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
          {product.category || 'Lifestyle'}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              {sym}{minPrice?.toLocaleString()}
            </span>
            {maxPrice > minPrice && (
              <span className={`text-[10px] font-bold opacity-40`}>- {sym}{maxPrice?.toLocaleString()}</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product, 1)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/5' : 'bg-black text-white hover:bg-gray-800 shadow-black/5'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
});

const Products = () => {
  const { handleFetchAllPublicProducts } = useProduct();
  const { products, loading, totalResults, totalPages } = useSelector(s => s.product);
  const user = useSelector(s => s.auth.user);
  const { isDark, toggleTheme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFetchAllPublicProducts({ 
        search, 
        sort: sortBy, 
        category: category === 'All' ? '' : category,
        minPrice,
        maxPrice,
        page, 
        limit: 12 
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [search, sortBy, category, minPrice, maxPrice, page, handleFetchAllPublicProducts]);

 const ProductSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton isDark={isDark} className="aspect-[3/4] rounded-2xl" />
          <Skeleton isDark={isDark} className="h-3 w-3/4" />
          <Skeleton isDark={isDark} className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} font-sans`}>
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-[#e0e0db]'}`}>
        <div className="max-w-[1536px] mx-auto flex items-center h-[64px] px-4 gap-4">
          <Link to="/products" className="shrink-0 flex items-center gap-2">
            <span className="text-[24px] font-black italic tracking-tighter">SHOPSTREAM</span>
            <span className="hidden md:block text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mt-1">E-STORE</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
             {user && (
                <Link
                    to="/orders"
                    className={`hidden sm:flex items-center h-10 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-colors ${isDark ? 'hover:bg-[#1e1e1e]' : 'hover:bg-[#e8e8e0]'}`}
                >
                    My Orders
                </Link>
            )}
            <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors ${isDark ? 'hover:bg-[#1e1e1e]' : 'hover:bg-[#e8e8e0]'}`}>
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>

            <Link to="/wishlist" className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors relative ${isDark ? 'hover:bg-[#1e1e1e]' : 'hover:bg-[#e8e8e0]'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {(wishlistItems?.length || 0) > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-current" />}
            </Link>

            <Link to="/cart" className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-colors relative ${isDark ? 'hover:bg-[#1e1e1e]' : 'hover:bg-[#e8e8e0]'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-current">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="relative group">
                <button className={`h-10 px-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${isDark ? "bg-[#1a1a1a] text-white hover:bg-[#222]" : "bg-black text-white hover:bg-gray-800 shadow-xl"}`}>
                  {user.fullname?.split(" ")[0]}
                </button>
                <div className={`absolute right-0 top-full mt-2 w-48 p-3 rounded-2xl border shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#eee]'}`}>
                    <div className="mb-2 px-2 py-1 text-[10px] font-black uppercase tracking-widest opacity-30 border-b border-current border-opacity-5">Account Menu</div>
                    <LogoutButton />
                </div>
              </div>
            ) : (
              <Link to="/login" className={`h-10 px-6 rounded-2xl text-[12px] font-black tracking-widest uppercase flex items-center transition-all ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800 shadow-xl'}`}>SIGN IN</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1536px] mx-auto px-4 py-8">
        <SearchSort 
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          category={category}
          setCategory={setCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          isDark={isDark}
          resultsCount={totalResults || 0}
          loading={loading}
        />

        {loading && page === 1 ? (
          <ProductSkeleton />
        ) : (products?.length || 0) === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-[#111]' : 'bg-white shadow-sm'}`}>
              <svg className="w-12 h-12 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h2 className="text-xl font-black italic mb-2 tracking-tight">No products found</h2>
            <p className={`text-sm max-w-xs mx-auto opacity-50`}>We couldn't find anything matching your filters. Try widening your search.</p>
            <button 
                onClick={() => { setSearch(''); setCategory('All'); setMinPrice(''); setMaxPrice(''); }}
                className="mt-8 text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
                Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
              {products.map(p => (
                <ProductCard key={p._id} product={p} isDark={isDark} addToCart={addToCart} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex items-center justify-center gap-3">
                <button 
                  disabled={page === 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo(0,0); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all disabled:opacity-20 ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white shadow-sm'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="flex items-center gap-2 px-6 h-12 rounded-2xl border border-current border-opacity-5">
                    <span className="text-xs font-black">PAGE {page}</span>
                    <span className="text-xs font-bold opacity-30">OF {totalPages}</span>
                </div>
                <button 
                  disabled={page === totalPages}
                  onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all disabled:opacity-20 ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white shadow-sm'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;