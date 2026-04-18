import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';

const Stars = memo(({ rating, size = 'w-4 h-4' }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`${size} ${s <= rating ? 'text-[#d4a017]' : 'text-[#ddd] dark:text-[#333]'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
));
Stars.displayName = 'Stars';

const StarPicker = memo(({ value, onSelect, size = 'w-7 h-7' }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1,2,3,4,5].map(s => (
        <button
          key={s} type="button"
          onMouseEnter={() => setHover(s)}
          onClick={() => onSelect(s)}
          className="transition-transform hover:scale-110"
        >
          <svg className={`${size} transition-colors ${s <= (hover || value) ? 'text-[#d4a017]' : 'text-[#ddd] dark:text-[#333]'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </button>
      ))}
    </div>
  );
});
StarPicker.displayName = 'StarPicker';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleFetchPublicProductById, handleAddReview, handleUpdateReview, handleDeleteReview } = useProduct();
  const { product, loading, error } = useSelector(s => s.product);
  const user = useSelector(s => s.auth.user);
  const { isDark, toggleTheme } = useTheme();
  const { addToCart, cartCount } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [qty, setQty] = useState(1);

  useEffect(() => { if (id) handleFetchPublicProductById(id); }, [id]);
  useEffect(() => { setActiveImg(0); setImgLoaded(false); }, [product?._id]);

  const images = product?.images || [];
  const isBuyer = user?.role === 'buyer';
  const userReview = product?.reviews?.find(r => r.user === user?._id || r.user === user?.id);
  const sym = SYM[product?.price?.currency] || product?.price?.currency || '';

  const dist = useMemo(() => {
    const d = [0,0,0,0,0];
    product?.reviews?.forEach(r => { if (r.rating >= 1 && r.rating <= 5) d[r.rating-1]++; });
    return d;
  }, [product?.reviews]);
  const total = product?.numReviews || 0;

  const handleBuy = useCallback(() => { if (!user) navigate('/login'); }, [user, navigate]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!reviewForm.comment.trim()) return;
    setSubmitting(true); setReviewMsg('');
    try {
      await handleAddReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setReviewMsg('Review submitted!');
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.comment.trim()) return;
    setSubmitting(true);
    try {
      await handleUpdateReview(id, editId, editForm);
      setEditId(null);
      setReviewMsg('Review updated!');
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const confirmDel = async () => {
    setDeleting(true);
    try {
      await handleDeleteReview(id, deleteId);
      setDeleteId(null);
      setReviewMsg('Review deleted');
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  if (loading && !product) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f4f4ef]'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40"></div>
          <span className={`text-xs tracking-widest uppercase font-medium ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>Loading…</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-3 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4ef] text-black'}`}>
        <h1 className="text-xl font-bold">Product Not Found</h1>
        <Link to="/products" className="text-sm underline opacity-60 hover:opacity-100">Back to Products</Link>
      </div>
    );
  }

  const inputCls = `w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-colors ${isDark ? 'bg-[#161616] border-[#2a2a2a] focus:border-[#444] text-white' : 'bg-white border-[#ddd] focus:border-[#999] text-black'}`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-[#f4f4ef] text-[#1a1a1a]'} font-sans`}>

      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1e1e1e]' : 'bg-[#f4f4ef]/95 border-[#ddd]'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/products" className="text-xl font-black italic tracking-[-0.04em]">SNITCH</Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}>
              {isDark ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
            <Link
              to="/cart"
              className={`p-2 rounded-lg relative ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center scale-110">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <span className={`text-sm font-medium ${isDark ? 'text-[#aaa]' : 'text-[#555]'}`}>Hi, {user.fullname?.split(' ')[0]}</span>
            ) : (
              <Link to="/login" className={`h-9 px-4 rounded-lg text-sm font-semibold flex items-center ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        <div className={`flex items-center gap-1.5 text-xs mb-5 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
          <Link to="/products" className="hover:underline">Products</Link>
          <span>›</span>
          <span className={isDark ? 'text-[#888]' : 'text-[#666]'}>{product.title?.slice(0, 50)}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          <div className="w-full lg:w-[55%] flex flex-col-reverse sm:flex-row gap-3">
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-2 sm:w-[72px] overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] scrollbar-hide shrink-0 pb-1 sm:pb-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => { setActiveImg(i); setImgLoaded(false); }}
                    onClick={() => { setActiveImg(i); setImgLoaded(false); }}
                    className={`shrink-0 w-[60px] h-[72px] sm:w-full sm:h-[72px] rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i
                        ? (isDark ? 'border-[#d4a017]' : 'border-[#d4a017]')
                        : (isDark ? 'border-[#252525] hover:border-[#444]' : 'border-[#e0e0dc] hover:border-[#aaa]')
                    }`}
                  >
                    <img src={img.url} alt={`View ${i+1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className={`relative flex-1 aspect-[4/5] sm:aspect-auto sm:h-[520px] rounded-xl overflow-hidden border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
              {!imgLoaded && images.length > 0 && (
                <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-[#161616]' : 'bg-[#eee]'}`} />
              )}
              {images.length > 0 ? (
                <img
                  key={activeImg}
                  src={images[activeImg]?.url}
                  alt={product.title}
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-contain p-4 transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-15">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              )}

              {images.length > 1 && (
                <span className={`absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-1 rounded ${isDark ? 'bg-black/70 text-white' : 'bg-white/80 text-black'}`}>
                  {activeImg + 1} / {images.length}
                </span>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug mb-3">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {total > 0 && (
                <>
                  <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-0.5 ${
                    (product.averageRating || 0) >= 4 ? 'bg-[#2d6a30] text-white' :
                    (product.averageRating || 0) >= 3 ? 'bg-[#a67c00] text-white' :
                    'bg-[#c53030] text-white'
                  }`}>
                    {(product.averageRating || 0).toFixed(1)}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </span>
                  <span className={`text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>{total.toLocaleString()} rating{total > 1 ? 's' : ''}</span>
                </>
              )}
            </div>

            <div className={`border-t mb-4 ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5df]'}`} />

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className={`text-sm ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>{sym}</span>
                <span className="text-3xl font-bold tracking-tight">{product.price?.amount?.toLocaleString()}</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>Inclusive of all taxes</p>
            </div>

            <div className={`border-t mb-4 ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5df]'}`} />

            <div className="mb-5">
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>About this product</h3>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-[#bbb]' : 'text-[#444]'}`}>
                {product.description}
              </p>
            </div>

            <div className={`border-t mb-4 ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5df]'}`} />

            <div className="flex items-center gap-3 mb-5">
              <span className={`text-sm font-medium ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>Qty:</span>
              <div className={`flex items-center border rounded-lg overflow-hidden ${isDark ? 'border-[#333]' : 'border-[#ddd]'}`}>
                <button onClick={() => setQty(q => Math.max(1, q-1))} className={`px-3 py-1.5 text-sm font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f0f0ec]'}`}>−</button>
                <span className={`px-4 py-1.5 text-sm font-semibold border-x ${isDark ? 'border-[#333]' : 'border-[#ddd]'}`}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(10, q+1))} className={`px-3 py-1.5 text-sm font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f0f0ec]'}`}>+</button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  addToCart(product, qty);
                  navigate('/payment');
                }}
                className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide transition-colors ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  addToCart(product, qty);
                }}
                className={`w-full py-3 rounded-lg font-bold text-sm tracking-wide border transition-colors ${isDark ? 'border-[#444] hover:bg-[#161616]' : 'border-[#ccc] hover:bg-white'}`}
              >
                Add to Cart
              </button>
            </div>

           
          </div>
        </div>

        <div className={`mt-10 rounded-2xl border p-6 sm:p-8 ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
          <h2 className="text-lg sm:text-xl font-bold mb-6">Customer Reviews</h2>

          {total > 0 && (
            <div className={`flex flex-col sm:flex-row gap-6 mb-8 p-5 rounded-xl ${isDark ? 'bg-[#0a0a0a] border border-[#1e1e1e]' : 'bg-[#fafaf7] border border-[#e5e5df]'}`}>
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-4xl font-bold">{(product.averageRating || 0).toFixed(1)}</span>
                <Stars rating={Math.round(product.averageRating || 0)} size="w-4 h-4" />
                <span className={`text-xs mt-1 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>{total} total</span>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(star => {
                  const cnt = dist[star-1];
                  const pct = total > 0 ? (cnt/total)*100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-2 font-medium">{star}</span>
                      <svg className="w-3 h-3 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <div className={`flex-1 h-[6px] rounded-full overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#e5e5df]'}`}>
                        <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`w-6 text-right ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {reviewMsg && (
            <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium border ${
              reviewMsg.toLowerCase().includes('fail')
                ? (isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600')
                : (isDark ? 'bg-green-900/20 border-green-800/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700')
            }`}>{reviewMsg}</div>
          )}

          {isBuyer && !userReview && (
            <form onSubmit={submitReview} className={`mb-8 p-5 rounded-xl border ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Write a Review</h3>
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>Your Rating</label>
                  <StarPicker value={reviewForm.rating} onSelect={(v) => setReviewForm(p => ({ ...p, rating: v }))} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>Comment</label>
                  <textarea required rows="3" placeholder="Share your experience…" value={reviewForm.comment}
                    onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" disabled={submitting || !reviewForm.comment.trim()}
                  className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-40 ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {isBuyer && userReview && editId === null && (
            <p className={`mb-5 text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>You've reviewed this product. Edit or delete below.</p>
          )}

          {!user && (
            <div className={`mb-6 p-5 rounded-xl border text-center ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
              <p className={`text-sm mb-3 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Sign in to write a review</p>
              <Link to="/login" className={`inline-block px-5 py-2 rounded-lg text-sm font-semibold ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-[#1a1a1a] text-white hover:bg-[#333]'}`}>Sign In</Link>
            </div>
          )}

          <div className="space-y-3">
            {product.reviews?.length > 0 ? product.reviews.map(review => {
              const isOwner = user && (review.user === user._id || review.user === user.id);
              const editing = editId === review._id;
              return (
                <div key={review._id} className={`p-4 rounded-xl border ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
                  {editing ? (
                    <form onSubmit={saveEdit} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Edit Review</span>
                        <button type="button" onClick={() => setEditId(null)} className={`text-xs underline ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Cancel</button>
                      </div>
                      <StarPicker value={editForm.rating} onSelect={v => setEditForm(p => ({ ...p, rating: v }))} size="w-6 h-6" />
                      <textarea required rows="3" value={editForm.comment} onChange={e => setEditForm(p => ({ ...p, comment: e.target.value }))} className={`${inputCls} resize-none`} />
                      <button type="submit" disabled={submitting} className={`px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-40 ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>{submitting ? 'Saving…' : 'Save'}</button>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#e5e5df] text-black'}`}>
                            {review.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{review.name}</span>
                              <Stars rating={review.rating} size="w-3 h-3" />
                            </div>
                            <span className={`text-[11px] ${isDark ? 'text-[#444]' : 'text-[#bbb]'}`}>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                        {isOwner && (
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditId(review._id); setEditForm({ rating: review.rating, comment: review.comment }); }}
                              className={`p-1.5 rounded-lg border ${isDark ? 'border-[#2a2a2a] hover:bg-[#161616]' : 'border-[#ddd] hover:bg-white'}`}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button onClick={() => setDeleteId(review._id)}
                              className={`p-1.5 rounded-lg border ${isDark ? 'border-red-900/40 text-red-500 hover:bg-red-950/30' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed pl-[42px] ${isDark ? 'text-[#bbb]' : 'text-[#555]'}`}>{review.comment}</p>
                    </>
                  )}
                </div>
              );
            }) : (
              <div className={`p-10 rounded-xl text-center border border-dashed ${isDark ? 'border-[#2a2a2a] text-[#444]' : 'border-[#ccc] text-[#aaa]'}`}>
                <p className="font-medium">No reviews yet</p>
                <p className="text-sm opacity-60 mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className={`relative w-full max-w-sm p-6 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-[#e0e0dc]'}`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-950/30' : 'bg-red-50'}`}>
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Delete Review?</h3>
              <p className={`text-sm mb-5 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>This cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteId(null)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-[#f5f5ef]'}`}>Cancel</button>
                <button onClick={confirmDel} disabled={deleting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{deleting ? 'Deleting…' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;