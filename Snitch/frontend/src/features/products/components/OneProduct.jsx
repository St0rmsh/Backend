import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';

const OneProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleDeleteProduct, handleUpdateProduct, handleAddReview } = useProduct();
    const { product, loading, error } = useSelector(state => state.product);
    const { isDark } = useTheme();

    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR"
    });
    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    // Review state
    const [reviewData, setReviewLocal] = useState({ rating: 5, comment: "" });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        if (id) {
            handleGetProductById(id);
        }
    }, [id]);

    // Initialize edit form when entering edit mode
    useEffect(() => {
        if (isEditing && product) {
            setEditData({
                title: product.title || "",
                description: product.description || "",
                priceAmount: product.price?.amount || "",
                priceCurrency: product.price?.currency || "INR"
            });
            setNewImages([]);
            setPreviewUrls([]);
        }
    }, [isEditing, product]);

    const onDelete = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setIsDeleting(true);
            try {
                await handleDeleteProduct(id);
                navigate("/seller");
            } catch (err) {
                console.error("Delete failed", err);
                setIsDeleting(false);
            }
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newUrls]);
        setNewImages(prev => [...prev, ...files]);
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]);
            return newUrls.filter((_, i) => i !== index);
        });
    };

    const onUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append("title", editData.title);
            formData.append("description", editData.description);
            formData.append("priceAmount", editData.priceAmount);
            formData.append("priceCurrency", editData.priceCurrency);
            
            newImages.forEach(img => {
                formData.append("images", img);
            });

            await handleUpdateProduct(id, formData);
            setIsEditing(false);
            // Refresh product data
            handleGetProductById(id);
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const onSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment.trim()) return;
        setIsSubmittingReview(true);
        try {
            await handleAddReview(id, reviewData);
            setReviewLocal({ rating: 5, comment: "" });
        } catch (err) {
            console.error("Review failed", err);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading && !product && !isUpdating) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5ef] text-black'}`}>
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-current animate-spin mb-4"></div>
                    <p className="text-sm font-medium tracking-widest uppercase opacity-50">Loading Item...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#f5f5ef] text-black'}`}>
                <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
                <Link to="/seller" className="text-sm underline opacity-70 hover:opacity-100">Back to Dashboard</Link>
            </div>
        );
    }

    const inputClass = `w-full px-3 py-2 rounded border outline-none text-sm transition-all focus:ring-1 ${
        isDark 
            ? 'bg-[#1a1a1a] border-[#333] focus:border-[#666] focus:ring-[#666]' 
            : 'bg-white border-[#dcdchb] focus:border-[#999] focus:ring-[#999]'
    }`;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans flex justify-center`}>
            <div className="w-full max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/seller" className={`flex items-center gap-2 p-2 px-4 rounded-full border text-sm font-medium transition-colors ${
                        isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#dcdchb] hover:bg-white'
                    }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        Back
                    </Link>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                isEditing 
                                ? (isDark ? 'bg-white text-black border-white hover:bg-gray-200' : 'bg-black text-white border-black hover:bg-gray-800')
                                : (isDark ? 'border-[#444] hover:border-[#666]' : 'border-[#ccc] hover:border-[#999]')
                            }`}
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Product'}
                        </button>
                        <button 
                            disabled={isDeleting}
                            onClick={onDelete}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 border 
                                ${isDark 
                                    ? 'border-red-900/40 text-red-500 hover:bg-red-950/30 hover:border-red-500/50' 
                                    : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                                }`}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16 p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                    
                    {/* Media Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className={`aspect-[4/5] rounded-xl overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'}`}>
                            {!isEditing ? (
                                product.images && product.images.length > 0 ? (
                                    <img src={product.images[currentImageIdx]?.url} alt={product.title} className="w-full h-full object-contain bg-white dark:bg-[#111]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">No Media Available</div>
                                )
                            ) : (
                                <div className="p-4 h-full flex flex-col items-center justify-center gap-4">
                                    <p className="text-sm opacity-70">Replacing images requires uploading a new set.</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {previewUrls.map((url, i) => (
                                            <div key={i} className="relative w-24 h-24 border rounded overflow-hidden group">
                                                <img src={url} className="w-full h-full object-cover" />
                                                <button onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                                            </div>
                                        ))}
                                        {newImages.length < 7 && (
                                            <label className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center rounded cursor-pointer opacity-60 hover:opacity-100">
                                                <span className="text-xs font-medium">Add</span>
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-xs text-red-500 opacity-80 mt-2">*If no new images are selected, the existing images remain unchanged.</p>
                                </div>
                            )}
                        </div>
                        {!isEditing && product.images && product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setCurrentImageIdx(idx)}
                                        className={`w-20 h-24 shrink-0 rounded-md overflow-hidden border-2 transition-all bg-white dark:bg-[#111] ${
                                            currentImageIdx === idx 
                                            ? (isDark ? 'border-white' : 'border-black')
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.url} alt="Thumbnail" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="w-full lg:w-1/2 flex flex-col py-2">
                        {isEditing ? (
                            <form onSubmit={onUpdate} className="flex flex-col h-full">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Title</label>
                                        <input required type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} className={inputClass} />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Amount</label>
                                            <input required type="number" value={editData.priceAmount} onChange={e => setEditData({...editData, priceAmount: e.target.value})} className={inputClass} />
                                        </div>
                                        <div className="w-1/3">
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Currency</label>
                                            <select value={editData.priceCurrency} onChange={e => setEditData({...editData, priceCurrency: e.target.value})} className={inputClass}>
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Description</label>
                                        <textarea required rows="6" value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className={`${inputClass} resize-none`} />
                                    </div>
                                </div>
                                <div className="mt-auto pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={isUpdating}
                                        className={`w-full py-3 rounded-lg font-bold tracking-wide transition-colors ${
                                            isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                                        } disabled:opacity-50`}
                                    >
                                        {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 leading-tight">{product.title}</h1>
                                    <p className="text-2xl font-medium tracking-wide">
                                        {product.price?.currency} {product.price?.amount}
                                    </p>
                                </div>

                                <div className="w-full border-t border-[#333] border-opacity-20 dark:border-opacity-100 my-6"></div>

                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Description</h3>
                                    <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-[#a0a0a0]' : 'text-[#4a4a4a]'}`}>
                                        {product.description}
                                    </p>
                                </div>
                                
                                <div className="mt-auto pt-4 flex flex-col gap-2">
                                    <p className={`text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>
                                        ID: <span className="font-mono">{product._id}</span>
                                    </p>
                                    <p className={`text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>
                                        Listed on: {new Date(product.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Reviews Section */}
            <div className={`mt-10 p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'} w-full max-w-5xl`}>
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                
                {/* Write Review Form */}
                {error && typeof error === 'object' && error.message?.includes('already reviewed') && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-lg text-sm">
                        You have already submitted a review for this product.
                    </div>
                )}
                <form onSubmit={onSubmitReview} className={`mb-10 p-6 rounded-xl border ${isDark ? 'border-[#333] bg-[#1a1a1a]' : 'border-[#e0e0e0] bg-[#fdfdfd]'}`}>
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-4">Write a Review</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Rating</label>
                            <select 
                                value={reviewData.rating} 
                                onChange={e => setReviewLocal({...reviewData, rating: Number(e.target.value)})}
                                className={inputClass}
                            >
                                <option value={5}>5 - Excellent</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={3}>3 - Average</option>
                                <option value={2}>2 - Poor</option>
                                <option value={1}>1 - Terrible</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Your Comment</label>
                            <textarea 
                                required 
                                rows="3" 
                                placeholder="Share your experience..."
                                value={reviewData.comment} 
                                onChange={e => setReviewLocal({...reviewData, comment: e.target.value})} 
                                className={`${inputClass} resize-none`} 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmittingReview || !reviewData.comment.trim()}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-colors ${
                                isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                            } disabled:opacity-50`}
                        >
                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review, idx) => (
                            <div key={idx} className={`pb-6 ${idx !== product.reviews.length - 1 ? (isDark ? 'border-b border-[#333]' : 'border-b border-[#e0e0e0]') : ''}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDark ? 'bg-[#333] text-white' : 'bg-[#e0e0e0] text-black'}`}>
                                            {review.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-sm">{review.name}</span>
                                    </div>
                                    <span className="text-xs opacity-50">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex text-[#FFA41C] mb-2 pl-10">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400' : (isDark ? 'text-[#444]' : 'text-gray-300')}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>
                                <p className={`pl-10 text-sm leading-relaxed ${isDark ? 'text-[#ccc]' : 'text-[#555]'}`}>
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className={`p-8 rounded-xl text-center border border-dashed ${isDark ? 'border-[#444] text-[#888]' : 'border-[#ccc] text-[#666]'}`}>
                            <p>No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OneProduct;