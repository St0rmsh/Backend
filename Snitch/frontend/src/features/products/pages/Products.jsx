import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

/* ══════════════════════════════════════════════════════════
   CURRENCY HELPER
   ══════════════════════════════════════════════════════════ */
const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

/* ══════════════════════════════════════════════════════════
   PRODUCT CARD  (memoized — skips re-render if props same)
   ══════════════════════════════════════════════════════════ */
const ProductCard = memo(({ product, isDark }) => {
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const images  = product.images || [];
  const img0    = images[0]?.url;
  const img1    = images[1]?.url;
  const showImg = hovering && img1 ? img1 : img0;

  const sym    = SYM[product.price?.currency] || '';
  const amount = product.price?.amount;
  const rating = product.averageRating || 0;
  const count  = product.numReviews || 0;

  return (
    <Link
      to={`/products/${product._id}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); }}
      className="group block"
    >
      <div className={`rounded-2xl overflow-hidden border transition-all duration-200 h-full flex flex-col
        ${isDark
          ? 'bg-[#141414] border-[#1f1f1f] hover:border-[#3a3a3a]'
          : 'bg-white border-[#ececec] hover:border-[#ccc] hover:shadow-lg'
        }`}
      >
        {/* ── Image ──────────────────────── */}
        <div className={`relative w-full aspect-[3/4] overflow-hidden ${isDark ? 'bg-[#0e0e0e]' : 'bg-[#fafaf8]'}`}>
          {img0 ? (
            <>
              {!loaded && <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0ec]'}`} />}
              <img
                key={showImg}
                src={showImg}
                alt={product.title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out
                  ${loaded ? 'opacity-100' : 'opacity-0'}
                  ${hovering ? 'scale-[1.04]' : 'scale-100'}
                `}
              />
              {/* multi-image indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-[5px]">
                  {images.slice(0, Math.min(images.length, 5)).map((_, i) => (
                    <span key={i} className={`block w-[5px] h-[5px] rounded-full transition-all
                      ${i === (hovering && img1 ? 1 : 0)
                        ? (isDark ? 'bg-white scale-125' : 'bg-[#1a1a1a] scale-125')
                        : (isDark ? 'bg-white/25' : 'bg-black/15')
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
          )}
        </div>

        {/* ── Info ────────────────────────── */}
        <div className="flex flex-col gap-1 p-3 sm:p-3.5 flex-1">
          {/* Title */}
          <h3 className={`text-[13px] leading-[1.4] font-medium line-clamp-2 min-h-[36px]
            ${isDark ? 'text-[#ccc] group-hover:text-white' : 'text-[#222] group-hover:text-black'}`}>
            {product.title}
          </h3>

          {/* Rating badge */}
          {count > 0 ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-[3px] text-[10.5px] font-bold leading-none px-[6px] py-[3.5px] rounded-[4px] text-white
                ${rating >= 4 ? 'bg-[#1e8530]' : rating >= 3 ? 'bg-[#b38600]' : 'bg-[#c03'}`}>
                {rating.toFixed(1)}
                <svg className="w-[9px] h-[9px]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </span>
              <span className={`text-[10.5px] ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                ({count.toLocaleString()})
              </span>
            </div>
          ) : null}

          {/* Price */}
          <div className="mt-auto pt-1.5">
            <span className={`text-[17px] sm:text-[19px] font-bold tracking-tight leading-none
              ${isDark ? 'text-white' : 'text-[#111]'}`}>
              {sym}{amount?.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});
ProductCard.displayName = 'ProductCard';

/* ══════════════════════════════════════════════════════════
   PRODUCTS PAGE
   ══════════════════════════════════════════════════════════ */
const Products = () => {
  const { handleFetchAllPublicProducts } = useProduct();
  const products = useSelector(s => s?.product?.products || []);
  const { loading } = useSelector(s => s.product);
  const { isDark, toggleTheme } = useTheme();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { handleFetchAllPublicProducts(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q ? products.filter(p => p.title?.toLowerCase().includes(q)) : [...products];

    switch (sortBy) {
      case 'priceLow':   return list.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
      case 'priceHigh':  return list.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
      case 'rating':     return list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'reviews':    return list.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
      case 'newest':
      default:
        // Backend already sorts newest-first; fallback to _id (MongoDB ObjectId encodes timestamp)
        return list.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (da && db) return db - da;
          // fallback: compare _id strings (later _id = newer)
          return (b._id || '').localeCompare(a._id || '');
        });
    }
  }, [products, search, sortBy]);

  const onSearch = useCallback(e => setSearch(e.target.value), []);
  const onSort   = useCallback(e => setSortBy(e.target.value), []);

  /* ── Skeleton grid ──────────── */
  const Skeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`rounded-2xl overflow-hidden ${isDark ? 'bg-[#141414]' : 'bg-white'}`}>
          <div className={`aspect-[3/4] animate-pulse ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f0f0ec]'}`} />
          <div className="p-3.5 space-y-2.5">
            <div className={`h-3 rounded w-[85%] ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#eee]'}`} />
            <div className={`h-3 rounded w-[55%] ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#eee]'}`} />
            <div className={`h-5 rounded w-[40%] mt-1 ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#eee]'}`} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} font-sans`}>

      {/* ═══ NAVBAR ══════════════════════════════ */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl ${isDark ? 'bg-[#0a0a0a]/95 border-b border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-b border-[#e0e0db]'}`}>
        <div className="max-w-[1360px] mx-auto flex items-center h-[56px] px-4 sm:px-6 gap-4">

          {/* Brand */}
          <Link to="/products" className="shrink-0 mr-2">
            <span className="text-[22px] font-black italic tracking-[-0.05em]">SNITCH</span>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden sm:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search for products…"
                value={search}
                onChange={onSearch}
                className={`w-full h-[38px] pl-9 pr-4 rounded-full text-[13px] border outline-none transition-colors
                  ${isDark
                    ? 'bg-[#161616] border-[#282828] focus:border-[#444] text-white placeholder-[#4a4a4a]'
                    : 'bg-white border-[#ddd] focus:border-[#aaa] text-black placeholder-[#aaa]'
                  }`}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-[#1e1e1e]' : 'hover:bg-[#e8e8e0]'}`}
            >
              {isDark ? (
                <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
            <Link
              to="/login"
              className={`h-[36px] px-5 rounded-full text-[13px] font-semibold flex items-center transition-colors
                ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#111] text-white hover:bg-[#333]'}`}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Search (mobile) */}
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search for products…"
              value={search}
              onChange={onSearch}
              className={`w-full h-[38px] pl-9 pr-4 rounded-full text-[13px] border outline-none
                ${isDark
                  ? 'bg-[#161616] border-[#282828] text-white placeholder-[#4a4a4a]'
                  : 'bg-white border-[#ddd] text-black placeholder-[#aaa]'
                }`}
            />
          </div>
        </div>
      </nav>

      {/* ═══ MAIN ════════════════════════════════ */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 sm:py-6">

        {/* Toolbar */}
        <div className="flex items-end justify-between mb-5 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {search ? `Results for "${search}"` : 'All Products'}
            </h1>
            <p className={`text-[12px] mt-0.5 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
              {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <select
            value={sortBy}
            onChange={onSort}
            className={`h-[34px] px-3 pr-7 rounded-full text-[12px] font-medium cursor-pointer border outline-none appearance-none
              bg-[length:12px_12px] bg-no-repeat bg-[position:right_10px_center]
              ${isDark
                ? 'bg-[#161616] border-[#282828] text-[#ccc] bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22%23555%22%20viewBox=%220%200%2020%2020%22%3E%3Cpath%20d=%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22/%3E%3C/svg%3E")]'
                : 'bg-white border-[#ddd] text-[#333] bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22%23999%22%20viewBox=%220%200%2020%2020%22%3E%3Cpath%20d=%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22/%3E%3C/svg%3E")]'
              }`}
          >
            <option value="newest">Newest First</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5 ${isDark ? 'bg-[#161616]' : 'bg-[#e8e8e3]'}`}>
              <svg className="w-8 h-8 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <h2 className="text-lg font-bold mb-1">{search ? 'No results' : 'No products yet'}</h2>
            <p className={`text-sm max-w-xs ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
              {search ? `Nothing matches "${search}". Try something else.` : 'Check back soon for new arrivals.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`mt-4 h-9 px-5 rounded-full text-sm font-medium border transition-colors
                  ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ccc] hover:bg-white'}`}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map(product => (
              <ProductCard key={product._id} product={product} isDark={isDark} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;