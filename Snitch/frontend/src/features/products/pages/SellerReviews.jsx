import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const SellerReviews = () => {
    const { handleGetAllProducts } = useProduct();
    const sellerProducts = useSelector(state => state?.product?.products || []);
    const { loading } = useSelector(state => state.product);
    const { isDark } = useTheme();

    const [filterProduct, setFilterProduct] = useState('all');
    const [filterRating, setFilterRating] = useState('all');

    useEffect(() => {
        handleGetAllProducts();
    }, []);

    // Aggregate all reviews with product info
    const allReviews = sellerProducts.flatMap(product =>
        (product.reviews || []).map(review => ({
            ...review,
            productTitle: product.title,
            productId: product._id,
            productImage: product.images?.[0]?.url
        }))
    );

    // Filter reviews
    const filteredReviews = allReviews
        .filter(r => filterProduct === 'all' || r.productId === filterProduct)
        .filter(r => filterRating === 'all' || r.rating === Number(filterRating))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Aggregate stats
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
        <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans`}>
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-opacity-20 dark:border-opacity-100" style={{ borderColor: isDark ? '#333' : '#ddd' }}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link to="/seller" className={`p-2 rounded-full border transition-colors ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-white'}`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#8b8b8b]' : 'text-[#5a5a5a]'}`}>
                        All reviews across your products
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(idx => (
                        <div key={idx} className={`animate-pulse rounded-xl h-32 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e8e8e4]'}`}></div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Total Reviews</p>
                            <p className="text-3xl font-bold">{totalReviews}</p>
                        </div>
                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Average Rating</p>
                            <div className="flex items-center gap-3">
                                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
                                <StaticStars rating={Math.round(averageRating)} />
                            </div>
                        </div>
                        <div className={`p-5 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>Rating Breakdown</p>
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map(star => {
                                    const count = ratingDistribution[star - 1];
                                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-1.5 text-xs">
                                            <span className="w-2 font-medium">{star}</span>
                                            <svg className="w-3 h-3 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#222]' : 'bg-[#e5e5df]'}`}>
                                                <div className="h-full bg-[#d4a017] rounded-full" style={{ width: `${pct}%` }}></div>
                                            </div>
                                            <span className={`w-5 text-right ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <select
                            value={filterProduct}
                            onChange={e => setFilterProduct(e.target.value)}
                            className={`h-10 px-3 rounded-lg border text-sm cursor-pointer outline-none ${isDark ? 'bg-[#1a1a1a] border-[#333] text-white' : 'bg-white border-[#ddd] text-black'}`}
                        >
                            <option value="all">All Products</option>
                            {sellerProducts.map(p => (
                                <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                        </select>
                        <select
                            value={filterRating}
                            onChange={e => setFilterRating(e.target.value)}
                            className={`h-10 px-3 rounded-lg border text-sm cursor-pointer outline-none ${isDark ? 'bg-[#1a1a1a] border-[#333] text-white' : 'bg-white border-[#ddd] text-black'}`}
                        >
                            <option value="all">All Ratings</option>
                            {[5, 4, 3, 2, 1].map(r => (
                                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                        <span className={`flex items-center text-sm ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>
                            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Reviews List */}
                    {filteredReviews.length === 0 ? (
                        <div className={`p-12 rounded-xl text-center border border-dashed ${isDark ? 'border-[#333] text-[#555]' : 'border-[#ccc] text-[#888]'}`}>
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                            <p className="font-medium text-lg mb-1">No reviews found</p>
                            <p className="text-sm opacity-60">
                                {totalReviews === 0 ? 'Your products have no reviews yet' : 'Try adjusting your filters'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review, idx) => (
                                <div key={review._id || idx} className={`p-5 rounded-xl border transition-all ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                        {/* Product Thumbnail */}
                                        <Link to={`/seller/${review.productId}`} className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border ${isDark ? 'border-[#333] bg-[#1a1a1a]' : 'border-[#e0e0dc] bg-[#f5f5ef]'}`}>
                                            {review.productImage ? (
                                                <img src={review.productImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-30">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                            )}
                                        </Link>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                                                <div>
                                                    <Link to={`/seller/${review.productId}`} className="font-semibold text-sm hover:underline">{review.productTitle}</Link>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${isDark ? 'bg-[#222] text-white' : 'bg-[#e0e0dc] text-black'}`}>
                                                            {review.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className={`text-sm ${isDark ? 'text-[#aaa]' : 'text-[#555]'}`}>{review.name}</span>
                                                        <span className={`text-xs ${isDark ? 'text-[#555]' : 'text-[#bbb]'}`}>·</span>
                                                        <span className={`text-xs ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <StaticStars rating={review.rating} size="w-3.5 h-3.5" />
                                            </div>
                                            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#bbb]' : 'text-[#555]'}`}>
                                                {review.comment}
                                            </p>
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
