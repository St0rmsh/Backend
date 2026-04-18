import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';

/**
 * CustomeReview - Reusable review display and form component
 * 
 * Props:
 * @param {Array}  reviews - Array of review objects
 * @param {Object} user - Current user object (null if not authenticated)
 * @param {Object} error - Error state from redux
 * @param {Function} onSubmitReview - Callback(e) for submitting a review
 * @param {Object} reviewData - { rating, comment } controlled state
 * @param {Function} setReviewData - Setter for reviewData
 * @param {boolean} isSubmittingReview - Loading state for submit
 * @param {Function} onUpdateReview - Callback(reviewId, data) for updating a review
 * @param {Function} onDeleteReview - Callback(reviewId) for deleting a review
 */
const CustomeReview = ({
    reviews = [],
    user = null,
    error = null,
    onSubmitReview,
    reviewData,
    setReviewData,
    isSubmittingReview = false,
    onUpdateReview,
    onDeleteReview,
}) => {
    const { isDark } = useTheme();
    const [hoverRating, setHoverRating] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ rating: 5, comment: '' });
    const [editHover, setEditHover] = useState(0);
    const [deleteModalId, setDeleteModalId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const isBuyer = user && user.role === 'buyer';
    const userReview = reviews.find(r => r.user === user?._id || r.user === user?.id);

    const inputClass = `w-full px-3 py-2 rounded-lg border outline-none text-sm transition-all ${isDark ? 'bg-[#1a1a1a] border-[#333] focus:border-[#555] text-white' : 'bg-white border-[#ddd] focus:border-[#999] text-black'}`;

    const InteractiveStars = ({ value, hover, onHover, onLeave, onClick, size = 'w-6 h-6' }) => (
        <div className="flex gap-0.5" onMouseLeave={onLeave}>
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onMouseEnter={() => onHover(star)}
                    onClick={() => onClick(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                >
                    <svg className={`${size} transition-colors ${star <= (hover || value) ? 'text-[#d4a017]' : (isDark ? 'text-[#333]' : 'text-[#ddd]')}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                </button>
            ))}
        </div>
    );

    const StaticStars = ({ rating, size = 'w-3.5 h-3.5' }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`${size} ${star <= rating ? 'text-[#d4a017]' : (isDark ? 'text-[#333]' : 'text-[#ddd]')}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );

    const startEditing = (review) => {
        setEditingId(review._id);
        setEditData({ rating: review.rating, comment: review.comment });
        setEditHover(0);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editData.comment.trim()) return;
        setIsUpdating(true);
        try {
            await onUpdateReview(editingId, editData);
            setEditingId(null);
        } catch (err) {
            console.error('Update failed', err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDeleteReview(deleteModalId);
            setDeleteModalId(null);
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className={`mt-10 p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'} w-full`}>
                <h2 className="text-xl sm:text-2xl font-bold mb-6">Customer Reviews</h2>
                
                {error && typeof error === 'object' && error.message?.includes('already reviewed') && (
                    <div className={`mb-4 p-3 rounded-lg border text-sm ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        You have already submitted a review for this product.
                    </div>
                )}

                {isBuyer && !userReview && onSubmitReview && (
                    <form onSubmit={onSubmitReview} className={`mb-8 p-5 rounded-xl border ${isDark ? 'border-[#222] bg-[#0f0f0f]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Write a Review</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Rating</label>
                                <InteractiveStars
                                    value={reviewData.rating}
                                    hover={hoverRating}
                                    onHover={setHoverRating}
                                    onLeave={() => setHoverRating(0)}
                                    onClick={(star) => setReviewData({...reviewData, rating: star})}
                                    size="w-7 h-7"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Your Comment</label>
                                <textarea 
                                    required 
                                    rows="3" 
                                    placeholder="Share your experience..."
                                    value={reviewData.comment} 
                                    onChange={e => setReviewData({...reviewData, comment: e.target.value})} 
                                    className={`${inputClass} resize-none`} 
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingReview || !reviewData.comment.trim()}
                                className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-colors disabled:opacity-50 ${
                                    isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="space-y-4">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((review) => {
                            const isOwner = user && (review.user === user._id || review.user === user.id);
                            const isEditingThis = editingId === review._id;

                            return (
                                <div key={review._id} className={`p-5 rounded-xl border transition-all ${isDark ? 'border-[#222] bg-[#0f0f0f]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
                                    {isEditingThis ? (
                                        <form onSubmit={handleUpdate} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold uppercase tracking-widest opacity-60">Edit Review</h4>
                                                <button type="button" onClick={() => setEditingId(null)} className={`text-xs font-medium underline ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>Cancel</button>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Rating</label>
                                                <InteractiveStars
                                                    value={editData.rating}
                                                    hover={editHover}
                                                    onHover={setEditHover}
                                                    onLeave={() => setEditHover(0)}
                                                    onClick={(star) => setEditData({...editData, rating: star})}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Comment</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    value={editData.comment}
                                                    onChange={e => setEditData({...editData, comment: e.target.value})}
                                                    className={`${inputClass} resize-none`}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isUpdating}
                                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 ${isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-black text-white hover:bg-gray-800'}`}
                                            >
                                                {isUpdating ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-[#222] text-white' : 'bg-[#e0e0dc] text-black'}`}>
                                                        {review.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-sm block">{review.name}</span>
                                                        <span className={`text-xs ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                                                            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <StaticStars rating={review.rating} />
                                                    {isOwner && onUpdateReview && (
                                                        <>
                                                            <button onClick={() => startEditing(review)} className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-white'}`} title="Edit">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                            </button>
                                                            <button onClick={() => setDeleteModalId(review._id)} className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-red-900/40 text-red-500 hover:bg-red-950/30' : 'border-red-200 text-red-600 hover:bg-red-50'}`} title="Delete">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`pl-12 text-sm leading-relaxed ${isDark ? 'text-[#bbb]' : 'text-[#555]'}`}>
                                                {review.comment}
                                            </p>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className={`p-10 rounded-xl text-center border border-dashed ${isDark ? 'border-[#333] text-[#555]' : 'border-[#ccc] text-[#888]'}`}>
                            <p className="font-medium">No reviews yet</p>
                            <p className="text-sm opacity-60 mt-1">Be the first to review!</p>
                        </div>
                    )}
                </div>
            </div>

            {deleteModalId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalId(null)}></div>
                    <div className={`relative w-full max-w-sm p-6 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-[#e0e0dc]'}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-950/30' : 'bg-red-50'}`}>
                                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Delete Review?</h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>This action cannot be undone.</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setDeleteModalId(null)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-[#f5f5ef]'}`}>
                                    Cancel
                                </button>
                                <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomeReview;