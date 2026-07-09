import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import { useCart } from '../../../context/CartContext';

import { useWishlist } from '../../../context/WishlistContext';
import LogoutButton from './LogoutButton';
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
const REVIEWS_LIMIT = 5;

// Recursive component for threaded reviews
const ReviewThread = ({ review, depth = 0, user, isDark, editId, setEditId, editForm, setEditForm, saveEdit, submitting, inputCls, replyForm, setReplyForm, submitReply, setDeleteId }) => {
  const isOwner = user && (review.userId?._id === user._id || review.userId?._id === user.id);
  const editing = editId === review._id;
  const isReplying = replyForm.parentId === review._id;
  const isSeller = review.role === 'seller';
  
  // UI Depth limit: flatten visually after depth 5
  const indentLevel = Math.min(depth, 5);
  const indentClass = indentLevel > 0 ? `ml-${indentLevel * 4} sm:ml-${indentLevel * 6} border-l-2 pl-4 ${isDark ? 'border-[#333]' : 'border-[#e0e0e0]'}` : '';

  return (
    <div className={`mt-4 ${indentClass}`}>
      <div className={`p-4 rounded-xl border ${isSeller ? (isDark ? 'bg-[#111105] border-[#444400]' : 'bg-[#fffdf0] border-[#e6e6c8]') : (isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-[#fafaf7]')}`}>
        {editing ? (
          <form onSubmit={saveEdit} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Edit Review</span>
              <button type="button" onClick={() => setEditId(null)} className={`text-xs underline ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Cancel</button>
            </div>
            {!review.parentId && (
              <StarPicker value={editForm.rating} onSelect={v => setEditForm(p => ({ ...p, rating: v }))} size="w-6 h-6" />
            )}
            <textarea required rows="3" value={editForm.comment} onChange={e => setEditForm(p => ({ ...p, comment: e.target.value }))} className={`${inputCls} resize-none`} />
            <button type="submit" disabled={submitting} className={`px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-40 ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>{submitting ? 'Saving…' : 'Save'}</button>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSeller ? 'bg-[#d4a017] text-white' : (isDark ? 'bg-[#1e1e1e] text-white' : 'bg-[#e5e5df] text-black')}`}>
                  {review.userId?.fullname?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.userId?.fullname || 'Anonymous'}</span>
                    {isSeller && <span className="text-[10px] bg-[#d4a017] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Seller</span>}
                    {!review.parentId && <Stars rating={review.rating} size="w-3 h-3" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] ${isDark ? 'text-[#444]' : 'text-[#bbb]'}`}>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    {review.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                {user && depth < 5 && (
                  <button onClick={() => setReplyForm({ parentId: isReplying ? null : review._id, comment: '' })}
                    className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${isDark ? 'hover:bg-[#1a1a1a] text-[#888]' : 'hover:bg-[#eee] text-[#666]'}`}>
                    {isReplying ? 'Cancel' : 'Reply'}
                  </button>
                )}
                {isOwner && (
                  <>
                    <button onClick={() => { setEditId(review._id); setEditForm({ rating: review.rating || 5, comment: review.comment }); }}
                      className={`p-1.5 rounded-lg border ${isDark ? 'border-[#2a2a2a] hover:bg-[#161616]' : 'border-[#ddd] hover:bg-white'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button onClick={() => setDeleteId(review._id)}
                      className={`p-1.5 rounded-lg border ${isDark ? 'border-red-900/40 text-red-500 hover:bg-red-950/30' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className={`text-sm leading-relaxed pl-[42px] ${isDark ? 'text-[#bbb]' : 'text-[#555]'}`}>{review.comment}</p>
          </>
        )}

        {isReplying && (
          <form onSubmit={submitReply} className={`mt-4 pl-[42px]`}>
            <textarea required rows="2" placeholder="Write a reply..." value={replyForm.comment} onChange={e => setReplyForm(p => ({ ...p, comment: e.target.value }))} className={`${inputCls} resize-none mb-2 text-xs`} />
            <button type="submit" disabled={submitting} className={`px-4 py-1.5 rounded-lg text-xs font-bold disabled:opacity-40 ${isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white'}`}>{submitting ? 'Posting…' : 'Post Reply'}</button>
          </form>
        )}
      </div>
      
      {review.replies && review.replies.length > 0 && (
        <div className="mt-2">
          {review.replies.map(reply => (
            <ReviewThread 
              key={reply._id} 
              review={reply} 
              depth={depth + 1} 
              user={user} 
              isDark={isDark} 
              editId={editId} 
              setEditId={setEditId} 
              editForm={editForm} 
              setEditForm={setEditForm} 
              saveEdit={saveEdit} 
              submitting={submitting} 
              inputCls={inputCls} 
              replyForm={replyForm} 
              setReplyForm={setReplyForm} 
              submitReply={submitReply} 
              setDeleteId={setDeleteId} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleFetchPublicProductById, handleAddReview, handleGetReviews, handleUpdateReview, handleDeleteReview } = useProduct();
  const { product, loading, error } = useSelector(s => s.product);
  const user = useSelector(s => s.auth.user);
  const { isDark, toggleTheme } = useTheme();
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  const [activeImg, setActiveImg] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [replyForm, setReplyForm] = useState({ parentId: null, comment: '' });

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reset to the first image whenever the selected variant changes
  useEffect(() => {
    setActiveImg(0);
    setImgError(false);
    setImgLoaded(false);
  }, [selectedVariant?._id]);

  // Reset loading state when browsing between images within the active set
  useEffect(() => {
    setImgLoaded(false);
  }, [activeImg]);

  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsSkip, setReviewsSkip] = useState(0);
  const REVIEWS_LIMIT = 5;

  const fetchReviews = useCallback(async (productId, append = false) => {
    if (!append) setReviewsLoading(true);

    try {
      const data = await handleGetReviews(productId, { 
        limit: REVIEWS_LIMIT, 
        skip: append ? reviewsSkip + REVIEWS_LIMIT : 0 
      });

      const newReviews = data?.reviews || [];
      setReviewsTotal(data?.total || 0);

      setReviews(prev => append ? [...prev, ...newReviews] : newReviews);

      if (append) {
        setReviewsSkip(prev => prev + REVIEWS_LIMIT);
      } else {
        setReviewsSkip(0);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  }, [handleGetReviews, reviewsSkip]);

  useEffect(() => { 
    if (!id) return;
    handleFetchPublicProductById(id);
    fetchReviews(id);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setActiveImg(0);
    setImgLoaded(false);
    setSelectedVariant(null);
    setQty(1);
  }, [product]);

  useEffect(() => { 
    setActiveImg(0); 
    setImgLoaded(false); 
    setSelectedVariant(null);
    setQty(1);
  }, [product?._id]);

  const images = product?.images || [];
  const activeImages = selectedVariant?.image?.length > 0 ? selectedVariant.image : images;
  const isBuyer = user?.role === 'buyer';
  const userReview = reviews?.find(r => (r.userId?._id === user?._id || r.userId?._id === user?.id) && !r.parentId);
  
  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;
  
  // Personalized stock calculation: subtract what's already in the cart
  const { cartItems } = useCart();
  const cartItem = cartItems.find(item => 
    item.productId.toString() === id.toString() && 
    (selectedVariant 
      ? item.variantId?.toString() === selectedVariant._id.toString() 
      : !item.variantId)
  );
  const cartQty = cartItem?.quantity || 0;

  const basePrice = product?.price;

  const displayPrice = selectedVariant?.price?.amount != null ? selectedVariant.price : basePrice;
  const sym = SYM[displayPrice?.currency || basePrice?.currency] || displayPrice?.currency || basePrice?.currency || "";
  
  const actualStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const displayStock = Math.max(0, actualStock - cartQty);
  const isOutOfStock = displayStock < 1;

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    if (variant.stock < 1) return;
    setSelectedVariant(variant);
    setQty(1); // Reset qty on variant change
  };

  const dist = useMemo(() => {
    const d = [0,0,0,0,0];
    reviews?.forEach(r => { if (r.rating >= 1 && r.rating <= 5 && !r.parentId) d[r.rating-1]++; });
    return d;
  }, [reviews]);
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
      fetchReviews(id);
      handleFetchPublicProductById(id); // Re-fetch product metadata
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!replyForm.comment.trim() || !replyForm.parentId) return;
    setSubmitting(true); setReviewMsg('');
    try {
      await handleAddReview(id, replyForm);
      setReplyForm({ parentId: null, comment: '' });
      fetchReviews(id); // refresh
    } catch (err) { setReviewMsg(err.message || 'Failed to post reply'); }
    finally { setSubmitting(false); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.comment.trim()) return;
    setSubmitting(true);
    try {
      await handleUpdateReview(id, editId, editForm);
      setEditId(null);
      setReviewMsg('Review updated successfully!');
      fetchReviews(id);
      handleFetchPublicProductById(id); // Sync global rating
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed to update review'); }
    finally { setSubmitting(false); }
  };

  const confirmDel = async () => {
    setDeleting(true);
    try {
      await handleDeleteReview(id, deleteId);
      setDeleteId(null);
      setReviewMsg('Review deleted');
      fetchReviews(id);
      handleFetchPublicProductById(id); // Sync global rating
      setTimeout(() => setReviewMsg(''), 4000);
    } catch (err) { setReviewMsg(err.message || 'Failed to delete review'); }
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
              to="/wishlist"
              className={`p-2 rounded-lg relative ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#e8e8e3]'}`}
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
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
              <div className="relative group">
                <button className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${isDark ? 'bg-[#1a1a1a] text-[#aaa] hover:text-white' : 'bg-[#e8e8e3] text-[#555] hover:text-black'}`}>
                  Hi, {user.fullname?.split(' ')[0]}
                </button>
                <div className={`absolute right-0 top-full mt-1 w-40 p-2 rounded-xl border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
                  <LogoutButton />
                </div>
              </div>
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
            {activeImages.length > 1 && (
              <div className="flex sm:flex-col gap-2 sm:w-[72px] overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] scrollbar-hide shrink-0 pb-1 sm:pb-0">
                {activeImages.map((img, i) => (
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
              {!imgLoaded && activeImages.length > 0 && (
                <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-[#161616]' : 'bg-[#eee]'}`} />
              )}
              
              {/* Dynamic Image Selection with Fallback */}
              <img
                key={`${selectedVariant?._id || 'base'}-${activeImg}`}
                src={
                  !imgError
                    ? (activeImages[activeImg]?.url || activeImages[0]?.url || 'https://placehold.co/600x800?text=Product+Image')
                    : (images[0]?.url || 'https://placehold.co/600x800?text=Product+Image')
                }
                alt={product.title}
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  if (selectedVariant?.image?.length > 0) {
                    setImgError(true);
                  }
                }}
                className={`w-full h-full object-contain p-4 transition-all duration-500 ease-out ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}
              />
              
              {selectedVariant && selectedVariant.image?.length > 0 && !imgError && (
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded bg-[#d4a017] text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                    Edition View
                  </span>
                </div>
              )}
              
              {imgError && selectedVariant && (
                <div className="absolute bottom-4 left-4">
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded ${isDark ? 'bg-red-950/40 text-red-500' : 'bg-red-50 text-red-600'}`}>
                    Image Unavailable - Showing Base Product
                  </span>
                </div>
              )}

              {activeImages.length > 1 && (
                <span className={`absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-1 rounded ${isDark ? 'bg-black/70 text-white' : 'bg-white/80 text-black'}`}>
                  {activeImg + 1} / {activeImages.length}
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
                <span className="text-3xl font-bold tracking-tight">{displayPrice?.amount?.toLocaleString()}</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>Inclusive of all taxes</p>
            </div>

            <div className={`border-t mb-4 ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5df]'}`} />

            {selectedVariant ? (
              <div className={`mb-6 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-4 duration-500 ${isDark ? 'bg-[#111] border-[#d4a017]/30' : 'bg-[#fffdf0] border-[#d4a017]/30'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#d4a017]' : 'text-[#a67c00]'}`}>Selected Edition</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-green-600">In Stock</span>
                  </div>
                </div>
                <div className="text-2xl font-black uppercase tracking-tighter italic mb-2 leading-none">
                  {selectedVariant.value}
                </div>
                
                {selectedVariant.attributes && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#444]' : 'text-[#aaa]'}`}>{key}</span>
                        <span className="text-[11px] font-black uppercase">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>About this product</h3>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-[#bbb]' : 'text-[#444]'}`}>
                  {product.description}
                </p>
              </div>
            )}

            {hasVariants && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                    Choose {variants[0]?.attributes ? Object.keys(variants[0].attributes)[0] : 'Variant'}
                  </h3>
                  {selectedVariant && (
                    <button 
                      onClick={() => setSelectedVariant(null)}
                      className={`text-[10px] font-bold uppercase tracking-widest underline opacity-50 hover:opacity-100 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {variants.map(v => {
                    const isSelected = selectedVariant?._id === v._id;
                    const outOfStock = v.stock < 1;
                    return (
                      <button
                        key={v._id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedVariant(null);
                          } else {
                            handleVariantSelect(v);
                          }
                        }}
                        disabled={outOfStock}
                        className={`group relative px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-300 flex flex-col items-center justify-center min-w-[80px] ${
                          isSelected 
                            ? (isDark ? 'bg-white text-black border-white shadow-[0_10px_25px_-5px_rgba(255,255,255,0.2)] scale-105' : 'bg-black text-white border-black shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] scale-105')
                            : outOfStock 
                              ? (isDark ? 'bg-[#0f0f0f] text-[#333] border-[#1a1a1a] cursor-not-allowed opacity-40' : 'bg-[#f9f9f9] text-[#ccc] border-[#eee] cursor-not-allowed opacity-40')
                              : (isDark ? 'bg-transparent text-[#888] border-[#1e1e1e] hover:border-[#444] hover:text-white' : 'bg-white text-[#666] border-[#e5e5df] hover:border-[#111] hover:text-black')
                        }`}
                      >
                        <span>{v.value}</span>
                        {v.price?.amount !== product.price?.amount && !isSelected && !outOfStock && (
                          <span className="text-[8px] mt-1 opacity-50">
                            {v.price?.amount > product.price?.amount ? '+' : '-'}{SYM[v.price?.currency] || ''}{Math.abs(v.price?.amount - product.price?.amount)}
                          </span>
                        )}
                        {outOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
                            <div className={`w-[150%] h-[1.5px] rotate-[25deg] ${isDark ? 'bg-red-900/50' : 'bg-red-200'}`} />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className={`border-t mb-4 ${isDark ? 'border-[#1e1e1e]' : 'border-[#e5e5df]'}`} />

            <div className="flex items-center gap-3 mb-5">
              <span className={`text-sm font-bold ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>Qty</span>
              <div className={`flex flex-col gap-1`}>
                <div className={`flex items-center border rounded-xl overflow-hidden ${isDark ? 'border-[#2a2a2a]' : 'border-[#e5e5df]'}`}>
                  <button onClick={() => setQty(q => Math.max(1, q-1))} disabled={isOutOfStock} className={`px-4 py-2 text-sm font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5f0]'}`}>−</button>
                  <span className={`px-5 py-2 text-sm font-black border-x ${isDark ? 'border-[#2a2a2a]' : 'border-[#e5e5df]'}`}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(displayStock, q+1))} disabled={isOutOfStock || qty >= displayStock} className={`px-4 py-2 text-sm font-bold ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-[#f5f5f0]'}`}>+</button>
                </div>
              </div>
              <span className={`text-xs ml-2 font-bold ${isOutOfStock ? 'text-red-500' : isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                {isOutOfStock ? 'Sold Out' : `${displayStock} available`}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={isOutOfStock || addingToCart}
                onClick={async () => {
                  if (hasVariants && !selectedVariant) {
                    alert(`Please select a ${variants[0]?.attributes ? Object.keys(variants[0].attributes)[0] : 'variant'} to proceed.`);
                    return;
                  }
                  setAddingToCart(true);
                  try {
                    await addToCart(product, qty, selectedVariant?._id);
                    navigate('/cart'); 
                  } finally {
                    setAddingToCart(false);
                  }
                }}
                className={`w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDark ? 'bg-white text-black hover:bg-[#eee]' : 'bg-[#111] text-white hover:bg-[#333]'}`}
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isOutOfStock ? 'Sold Out' : 'Buy Now'}
              </button>
              <div className="flex gap-3">
                <button
                  disabled={isOutOfStock || addingToCart}
                  onClick={async () => {
                    if (hasVariants && !selectedVariant) {
                        alert(`Please select a ${variants[0]?.attributes ? Object.keys(variants[0].attributes)[0] : 'variant'} to proceed.`);
                        return;
                    }
                    setAddingToCart(true);
                    try {
                      await addToCart(product, qty, selectedVariant?._id);
                    } finally {
                      setAddingToCart(false);
                    }
                  }}
                  className={`flex-1 py-4 rounded-xl font-black text-sm tracking-widest uppercase border-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isDark ? 'border-[#2a2a2a] hover:bg-[#161616] text-white' : 'border-[#111] hover:bg-black hover:text-white text-[#111]'}`}
                >
                  {addingToCart ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => toggleWishlist(id)}
                  className={`w-14 rounded-lg border flex items-center justify-center transition-all active:scale-[0.98] ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : (isDark ? 'border-[#444] hover:bg-[#161616]' : 'border-[#ccc] hover:bg-white')}`}
                >
                  <svg className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
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
            {reviewsLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40"></div>
              </div>
            ) : reviews?.length > 0 ? (
              reviews.map(review => (
                <ReviewThread 
                  key={review._id} 
                  review={review} 
                  depth={0} 
                  user={user} 
                  isDark={isDark} 
                  editId={editId} 
                  setEditId={setEditId} 
                  editForm={editForm} 
                  setEditForm={setEditForm} 
                  saveEdit={saveEdit} 
                  submitting={submitting} 
                  inputCls={inputCls} 
                  replyForm={replyForm} 
                  setReplyForm={setReplyForm} 
                  submitReply={submitReply} 
                  setDeleteId={setDeleteId} 
                />
              ))
            ) : (
              <div className={`p-10 rounded-xl text-center border border-dashed ${isDark ? 'border-[#2a2a2a] text-[#444]' : 'border-[#ccc] text-[#aaa]'}`}>
                <p className="font-medium">No reviews yet</p>
                <p className="text-sm opacity-60 mt-1">Be the first to share your experience!</p>
              </div>
            )}

            {reviews.length < reviewsTotal && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => fetchReviews(id, true)}
                  disabled={reviewsLoading}
                  className={`px-6 py-2 rounded-lg text-xs font-bold border transition-colors ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-white'}`}
                >
                  {reviewsLoading ? 'Loading…' : 'Load More Reviews'}
                </button>
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