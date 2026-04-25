import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';

const SellerReviews = () => {
    const { handleGetSellerReviews } = useProduct();
    const { isDark } = useTheme();
    const user = useSelector(state => state.auth.user);

    const [filterProduct, setFilterProduct] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    
    const [reviewsData, setReviewsData] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const data = await handleGetSellerReviews();
            setReviewsData(data.reviews || []);
            setProductsData(data.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [handleGetSellerReviews]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleReply = async (reviewId) => {
        if (!replyText.trim()) return;
        setSubmitting(true);
        try {
            const res = await axios.post(`/api/products/reviews/${reviewId}/reply`, { comment: replyText }, { withCredentials: true });
            if (res.data.success) {
                setMsg({ type: 'success', text: 'Reply posted successfully' });
                setReplyingTo(null);
                setReplyText('');
                fetchReviews(); // Refresh data
            }
        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to post reply' });
        } finally {
            setSubmitting(false);
            setTimeout(() => setMsg(null), 3000);
        }
    };

    const allReviews = reviewsData.map(review => {
        const product = productsData.find(p => p._id === review.productId);
        return {
            ...review,
            productTitle: product?.title || 'Unknown Product',
            productImage: product?.images?.[0]?.url,
            name: review.userId?.fullname || 'Anonymous'
        };
    });

    const filteredReviews = allReviews
        .filter(r => filterProduct === 'all' || r.productId === filterProduct)
        .filter(r => filterRating === 'all' || r.rating === Number(filterRating))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews : 0;
    const ratingDistribution = [0, 0, 0, 0, 0];
    allReviews.forEach(r => { if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++; });

    const StaticStars = ({ rating, size = 'w-4 h-4' }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`${size} ${star <= rating ? 'text-[#d4a017]' : (isDark ? 'text-[#333]' : 'text-[#ddd]')}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans`}>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-current border-opacity-5">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link to="/seller" className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        </Link>
                        <h1 className="text-3xl font-black italic tracking-tighter">CUSTOMER FEEDBACK</h1>
                    </div>
                    <p className={`text-[11px] font-bold uppercase tracking-widest opacity-30`}>Manage your product reputation</p>
                </div>
            </header>

            {msg && (
                <div className={`mb-6 p-4 rounded-2xl border animate-in slide-in-from-top-4 duration-300 ${msg.type === 'success' ? (isDark ? 'bg-green-950/20 border-green-800/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700') : (isDark ? 'bg-red-950/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700')}`}>
                    <p className="text-sm font-bold">{msg.text}</p>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(idx => (
                        <div key={idx} className={`animate-pulse rounded-3xl h-32 ${isDark ? 'bg-[#111]' : 'bg-[#e8e8e4]'}`}></div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-xl shadow-black/5'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-3 opacity-30`}>Total Reviews</p>
                            <p className="text-4xl font-black italic tracking-tighter">{totalReviews}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-xl shadow-black/5'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-3 opacity-30`}>Average Rating</p>
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-black italic tracking-tighter">{averageRating.toFixed(1)}</p>
                                <StaticStars rating={Math.round(averageRating)} size="w-5 h-5" />
                            </div>
                        </div>
                        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-xl shadow-black/5'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest mb-3 opacity-30`}>Breakdown</p>
                            <div className="space-y-1.5">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = ratingDistribution[star - 1];
                                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-2 text-[10px]">
                                            <span className="w-2 font-black">{star}</span>
                                            <div className={`flex-1 h-1 rounded-full overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#f0f0ed]'}`}>
                                                <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <span className={`w-6 text-right font-bold opacity-30`}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-4 mb-8">
                        <select
                            value={filterProduct}
                            onChange={e => setFilterProduct(e.target.value)}
                            className={`h-[52px] px-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest outline-none transition-all ${isDark ? 'bg-[#111] border-[#1e1e1e] text-white hover:border-[#333]' : 'bg-white border-[#e5e5df] text-black hover:border-[#aaa]'}`}
                        >
                            <option value="all">ALL PRODUCTS</option>
                            {productsData.map(p => (
                                <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                        </select>
                        <select
                            value={filterRating}
                            onChange={e => setFilterRating(e.target.value)}
                            className={`h-[52px] px-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest outline-none transition-all ${isDark ? 'bg-[#111] border-[#1e1e1e] text-white hover:border-[#333]' : 'bg-white border-[#e5e5df] text-black hover:border-[#aaa]'}`}
                        >
                            <option value="all">ALL RATINGS</option>
                            {[5, 4, 3, 2, 1].map(r => (
                                <option key={r} value={r}>{r} STAR{r > 1 ? 'S' : ''}</option>
                            ))}
                        </select>
                        <div className="flex-1" />
                        <div className={`h-[52px] px-6 rounded-2xl border flex items-center ${isDark ? 'bg-white/5 border-[#1e1e1e]' : 'bg-black/5 border-[#e5e5df]'}`}>
                             <span className="text-[11px] font-black uppercase tracking-widest opacity-40">{filteredReviews.length} Results Found</span>
                        </div>
                    </div>

                    {filteredReviews.length === 0 ? (
                        <div className={`p-24 rounded-[40px] text-center border border-dashed ${isDark ? 'border-[#1e1e1e] bg-[#0e0e0e]' : 'border-[#e5e5df] bg-white shadow-inner'}`}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 opacity-10">
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                            </div>
                            <h2 className="text-2xl font-black italic mb-2 tracking-tighter">No reviews found</h2>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-30">Try clearing your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredReviews.map((review) => (
                                <div key={review._id} className={`p-6 rounded-[32px] border transition-all duration-300 ${isDark ? 'bg-[#111] border-[#1e1e1e] hover:border-[#d4a017]/30' : 'bg-white border-[#e5e5df] hover:border-[#111] hover:shadow-2xl hover:shadow-black/5'}`}>
                                    <div className="flex gap-5">
                                        <Link to={`/seller/${review.productId}`} className={`shrink-0 w-16 h-16 rounded-2xl overflow-hidden border ${isDark ? 'border-[#1e1e1e] bg-[#0a0a0a]' : 'border-[#e5e5df] bg-[#fafaef]'}`}>
                                            {review.productImage ? (
                                                <img src={review.productImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-10">
                                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                            )}
                                        </Link>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <Link to={`/seller/${review.productId}`} className="text-xs font-black uppercase tracking-widest hover:underline truncate">{review.productTitle}</Link>
                                                <StaticStars rating={review.rating} size="w-3 h-3" />
                                            </div>

                                            <div className="flex items-center gap-2 mb-4">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                                    {review.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black uppercase">{review.name}</span>
                                                    <span className={`text-[9px] font-bold opacity-30 uppercase tracking-widest`}>
                                                        {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                {review.verifiedPurchase && (
                                                    <span className="ml-auto text-[8px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Verified</span>
                                                )}
                                            </div>

                                            <p className={`text-sm leading-relaxed mb-6 italic ${isDark ? 'text-[#888]' : 'text-[#444]'}`}>
                                                "{review.comment}"
                                            </p>

                                            {/* Existing Replies */}
                                            {review.replies && review.replies.length > 0 && (
                                                <div className="space-y-3 mb-6">
                                                    {review.replies.map(reply => (
                                                        <div key={reply._id} className={`p-4 rounded-2xl border-l-4 ${isDark ? 'bg-white/5 border-[#d4a017] text-[#aaa]' : 'bg-[#fcfbf4] border-[#d4a017] text-[#666]'}`}>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-[#d4a017]">Seller Reply</span>
                                                                <span className="text-[8px] opacity-30">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-xs font-medium">{reply.comment}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-end pt-4 border-t border-current border-opacity-5">
                                                {replyingTo === review._id ? (
                                                    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                        <textarea 
                                                            autoFocus
                                                            placeholder="Write a professional reply…"
                                                            value={replyText}
                                                            onChange={e => setReplyText(e.target.value)}
                                                            className={`w-full p-4 rounded-2xl border text-xs font-medium outline-none transition-all mb-3 ${isDark ? 'bg-[#1a1a1a] border-[#333] text-white focus:border-[#d4a017]' : 'bg-[#fafafa] border-[#e5e5df] text-black focus:border-black'}`}
                                                            rows="3"
                                                        />
                                                        <div className="flex justify-end gap-3">
                                                            <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100">Cancel</button>
                                                            <button 
                                                                onClick={() => handleReply(review._id)}
                                                                disabled={submitting || !replyText.trim()}
                                                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}
                                                            >
                                                                {submitting ? 'Posting…' : 'Post Reply'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => setReplyingTo(review._id)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border transition-all active:scale-95 ${isDark ? 'border-[#1e1e1e] text-white hover:bg-white hover:text-black' : 'border-[#e5e5df] text-black hover:bg-black hover:text-white'}`}
                                                    >
                                                        {review.replies?.some(r => r.role === 'seller') ? 'Update Reply' : 'Reply to Feedback'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SellerReviews;
