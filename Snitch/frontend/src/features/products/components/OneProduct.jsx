import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../context/ThemeContext';
import Skeleton from "../components/ui/Skeleton";

const OneProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleDeleteProduct, handleUpdateProduct, handleAddProductVariant, handleDeleteProductVariant } = useProduct();
    const { product, loading, error } = useSelector(state => state.product);
    const { isDark } = useTheme();

    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
        stock: ""
    });
    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showCurrency, setShowCurrency] = useState(false);

    // Variant State
    const [showAddVariant, setShowAddVariant] = useState(false);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [showVariantCurrency, setShowVariantCurrency] = useState(false);
    const [variantData, setVariantData] = useState({
        value: "",
        stock: "",
        priceAmount: "",
        priceCurrency: "INR"
    });
    const [variantImages, setVariantImages] = useState([]);
    const [variantPreviewUrls, setVariantPreviewUrls] = useState([]);

    const currencies = [
        { code: "INR", symbol: "₹", name: "Rupee" },
        { code: "USD", symbol: "$", name: "USD" },
        { code: "EUR", symbol: "€", name: "Euro" },
        { code: "GBP", symbol: "£", name: "Pound" },
        { code: "JPY", symbol: "¥", name: "Yen" }
    ];

    useEffect(() => {
        if (id) {
            handleGetProductById(id);
        }
    }, [id]);

    useEffect(() => {
        setCurrentImageIdx(0);
      }, [selectedVariant]);


    useEffect(() => {
        if (isEditing && product) {
            setEditData({
                title: product.title || "",
                description: product.description || "",
                priceAmount: product.price?.amount || "",
                priceCurrency: product.price?.currency || "INR",
                stock: product.stock !== undefined ? product.stock : ""
            });
            setNewImages([]);
            setPreviewUrls([]);
        }
    }, [isEditing, product]);


    const onDelete = async () => {
        setIsDeleting(true);
        try {
            await handleDeleteProduct(id);
            navigate("/seller");
        } catch (err) {
            console.error("Delete failed", err);
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const addFiles = (files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) return;
        const remaining = 7 - newImages.length;
        const toAdd = validFiles.slice(0, remaining);
        const urls = toAdd.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
        setNewImages(prev => [...prev, ...toAdd]);
    };

    const handleImageChange = (e) => {
        addFiles(e.target.files);
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]);
            return newUrls.filter((_, i) => i !== index);
        });
    };

    const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const onDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    }, [newImages.length]);

    const onUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append("title", editData.title);
            formData.append("description", editData.description);
            formData.append("priceAmount", editData.priceAmount);
            formData.append("priceCurrency", editData.priceCurrency);
            formData.append("stock", editData.stock);
            
            newImages.forEach(img => {
                formData.append("images", img);
            });

            await handleUpdateProduct(id, formData);
            setIsEditing(false);
            handleGetProductById(id);
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddVariant = async (e) => {
        e.preventDefault();
        setIsAddingVariant(true);
        try {
            const formData = new FormData();
            formData.append("value", variantData.value);
            formData.append("stock", variantData.stock);
            formData.append("priceAmount", variantData.priceAmount);
            formData.append("priceCurrency", variantData.priceCurrency);
            variantImages.forEach(img => {
                formData.append("images", img);
            });
            await handleAddProductVariant(id, formData);
            setShowAddVariant(false);
            setVariantData({ value: "", stock: "", priceAmount: "", priceCurrency: "INR" });
            setVariantImages([]);
            setVariantPreviewUrls([]);
        } catch (err) {
            console.error("Variant add failed", err);
        } finally {
            setIsAddingVariant(false);
        }
    };

    const onDeleteVariant = async (variantId) => {
        if (window.confirm("Delete this variant?")) {
            try {
                await handleDeleteProductVariant(id, variantId);
            } catch (err) {
                console.error("Variant delete failed", err);
            }
        }
    };

    const onAddVariantFiles = (files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) return;
        const remaining = 7 - variantImages.length;
        const toAdd = validFiles.slice(0, remaining);
        const urls = toAdd.map(file => URL.createObjectURL(file));
        setVariantPreviewUrls(prev => [...prev, ...urls]);
        setVariantImages(prev => [...prev, ...toAdd]);
    };

    const removeVariantImage = (index) => {
        setVariantImages(prev => prev.filter((_, i) => i !== index));
        setVariantPreviewUrls(prev => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]);
            return newUrls.filter((_, i) => i !== index);
        });
    };

    const StaticStars = ({ rating, size = 'w-4 h-4' }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`${size} ${star <= rating ? 'text-[#d4a017]' : (isDark ? 'text-[#333]' : 'text-[#ddd]')}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            ))}
        </div>
    );

    const getRatingDistribution = () => {
        const dist = [0, 0, 0, 0, 0];
        product?.reviews?.forEach(r => {
            if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
        });
        return dist;
    };

   if (loading && !product && !isUpdating) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 font-sans flex justify-center`}>
                <div className="w-full max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <Skeleton isDark={isDark} className="h-10 w-24 rounded-full" />
                        <div className="flex gap-3">
                            <Skeleton isDark={isDark} className="h-10 w-32 rounded-lg" />
                            <Skeleton isDark={isDark} className="h-10 w-24 rounded-lg" />
                        </div>
                    </div>

                    <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16 p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                            <Skeleton isDark={isDark} className="aspect-[4/5] rounded-xl" />
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} isDark={isDark} className="w-20 h-24 rounded-md" />
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-4 py-2">
                            <Skeleton isDark={isDark} className="h-9 w-4/5" />
                            <Skeleton isDark={isDark} className="h-5 w-40" />
                            <Skeleton isDark={isDark} className="h-8 w-32" />
                            <div className={`w-full border-t my-2 ${isDark ? 'border-[#222]' : 'border-[#e5e5df]'}`}></div>
                            <Skeleton isDark={isDark} className="h-4 w-full" />
                            <Skeleton isDark={isDark} className="h-4 w-full" />
                            <Skeleton isDark={isDark} className="h-4 w-2/3" />
                            <div className="mt-auto pt-4 space-y-2">
                                <Skeleton isDark={isDark} className="h-3 w-32" />
                                <Skeleton isDark={isDark} className="h-3 w-48" />
                                <Skeleton isDark={isDark} className="h-3 w-40" />
                            </div>
                        </div>
                    </div>

                    <div className={`mt-10 p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                        <Skeleton isDark={isDark} className="h-7 w-56 mb-6" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} isDark={isDark} className="h-32 rounded-xl" />
                            ))}
                        </div>
                    </div>
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

    const inputClass = `w-full px-3 py-2.5 rounded-lg border outline-none text-sm transition-all ${
        isDark 
            ? 'bg-[#1a1a1a] border-[#333] focus:border-[#555] text-white' 
            : 'bg-white border-[#ddd] focus:border-[#999] text-black'
    }`;

    const distribution = getRatingDistribution();
    const totalReviews = product.numReviews || 0;

   

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans flex justify-center`}>
            <div className="w-full max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/seller" className={`flex items-center gap-2 p-2 px-4 rounded-full border text-sm font-medium transition-colors ${
                        isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-white'
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
                            onClick={() => setShowDeleteModal(true)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border 
                                ${isDark 
                                    ? 'border-red-900/40 text-red-500 hover:bg-red-950/30 hover:border-red-500/50' 
                                    : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'
                                }`}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className={`flex flex-col lg:flex-row gap-10 lg:gap-16 p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                    
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className={`aspect-[4/5] rounded-xl overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'}`}>
                            {!isEditing ? (
                                (selectedVariant?.image?.length > 0 ? selectedVariant.image : product.images)?.length > 0 ? (
                                    <img
                                        src={(selectedVariant?.image?.length > 0 ? selectedVariant.image : product.images)[currentImageIdx]?.url
                                             || (selectedVariant?.image?.[0]?.url || product.images?.[0]?.url)}
                                        alt={product.title}
                                        className="w-full h-full object-contain bg-white dark:bg-[#111]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">No Media Available</div>
                                )
                            ) : (
                                <div
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    className={`p-4 h-full flex flex-col items-center justify-center gap-4 transition-all duration-200 rounded-xl ${
                                        isDragging
                                            ? (isDark ? 'border-2 border-dashed border-white/40 bg-[#222]' : 'border-2 border-dashed border-black/30 bg-[#f0f0f0]')
                                            : ''
                                    }`}
                                >
                                    {previewUrls.length === 0 ? (
                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${isDark ? 'bg-[#222]' : 'bg-[#ddd]'}`}>
                                                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                                </svg>
                                            </div>
                                            <p className="text-sm font-medium mb-1">
                                                {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                                            </p>
                                            <p className={`text-xs mb-3 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>or</p>
                                            <label className={`px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border transition-colors ${isDark ? 'border-[#444] hover:bg-[#222]' : 'border-[#ccc] hover:bg-[#f5f5ef]'}`}>
                                                Browse Files
                                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                            </label>
                                            <p className={`text-xs mt-3 ${isDark ? 'text-[#555]' : 'text-[#aaa]'}`}>Up to 7 images · PNG, JPG, WEBP</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {previewUrls.map((url, i) => (
                                                    <div key={i} className={`relative w-20 h-24 border rounded-lg overflow-hidden group ${isDark ? 'border-[#333]' : 'border-[#ddd]'}`}>
                                                        <img src={url} className="w-full h-full object-cover" />
                                                        <button 
                                                            onClick={() => removeNewImage(i)} 
                                                            className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                {newImages.length < 7 && (
                                                    <label className={`w-20 h-24 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'border-[#444]' : 'border-[#ccc]'}`}>
                                                        <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                                        <span className="text-[10px] font-medium">Add</span>
                                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                                    </label>
                                                )}
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>
                                                {newImages.length}/7 images · Drag more or click "Add"
                                            </p>
                                            <p className="text-xs text-red-500 opacity-80">*Existing images remain if no new ones selected.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {!isEditing && (() => {
                            const activeImages = selectedVariant?.image?.length > 0 ? selectedVariant.image : product.images;
                            return activeImages && activeImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {activeImages.map((img, idx) => (
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
                            );
                        })()}
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col py-2">
                        {isEditing ? (
                            <form onSubmit={onUpdate} className="flex flex-col h-full">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Title</label>
                                        <input required type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} className={inputClass} />
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex-1 min-w-[120px]">
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Amount</label>
                                            <input required type="number" min="0" value={editData.priceAmount} onChange={e => setEditData({...editData, priceAmount: e.target.value})} className={inputClass} />
                                        </div>
                                        <div className="w-1/3 min-w-[100px]">
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Currency</label>
                                            <div className="relative">
                                                <div 
                                                    onClick={() => setShowCurrency(!showCurrency)}
                                                    className={`${inputClass} flex items-center justify-between cursor-pointer`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className={`font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>
                                                            {currencies.find(c => c.code === editData.priceCurrency)?.symbol}
                                                        </span>
                                                        <span className="font-semibold">{editData.priceCurrency}</span>
                                                    </span>
                                                    <svg className={`w-4 h-4 opacity-50 transition-transform ${showCurrency ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                                </div>
                                                
                                                {showCurrency && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setShowCurrency(false)}></div>
                                                        <div className={`absolute z-20 w-full mt-2 rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#e5e5df]'}`}>
                                                            {currencies.map(c => (
                                                                <div 
                                                                    key={c.code}
                                                                    onClick={() => { setEditData({...editData, priceCurrency: c.code}); setShowCurrency(false); }}
                                                                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                                                                        editData.priceCurrency === c.code 
                                                                            ? (isDark ? 'bg-[#333] text-white' : 'bg-[#f5f5ef] text-black') 
                                                                            : (isDark ? 'hover:bg-[#222]' : 'hover:bg-[#fafaf7]')
                                                                    }`}
                                                                >
                                                                    <span className={`w-5 text-center font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>{c.symbol}</span>
                                                                    <span className="font-semibold">{c.code}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-1/3 min-w-[120px]">
                                            <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Base Stock</label>
                                            <input required type="number" min="0" value={editData.stock} onChange={e => setEditData({...editData, stock: e.target.value})} className={inputClass} />
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
                                    <div className="flex items-center gap-3 mb-3">
                                        <StaticStars rating={Math.round(product.averageRating || 0)} />
                                        <span className="text-sm font-semibold">{(product.averageRating || 0).toFixed(1)}</span>
                                        <span className={`text-sm ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>({totalReviews} reviews)</span>
                                    </div>
                                   <p className="text-2xl font-medium tracking-wide">
                                        {(selectedVariant?.price?.currency || product.price?.currency)} {(selectedVariant?.price?.amount ?? product.price?.amount)}
                                    </p>
                                </div>

                                <div className={`w-full border-t my-6 ${isDark ? 'border-[#222]' : 'border-[#e5e5df]'}`}></div>

                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Description</h3>
                                    <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-[#a0a0a0]' : 'text-[#4a4a4a]'}`}>
                                        {product.description}
                                    </p>
                                </div>
                                
                                <div className="mt-auto pt-4 flex flex-col gap-2">
                                    <p className={`text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>
                                        {selectedVariant ? 'Variant Stock' : 'Base Stock'}: <span className="font-mono text-current">{selectedVariant ? selectedVariant.stock : product.stock}</span>
                                    </p>
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

                {/* Variants Section */}
                <div className={`mt-10 p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold">Product Variants</h2>
                        <button 
                            onClick={() => setShowAddVariant(!showAddVariant)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                showAddVariant 
                                ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                                : (isDark ? 'border-[#444] hover:border-[#666]' : 'border-[#ccc] hover:border-[#999]')
                            }`}
                        >
                            {showAddVariant ? 'Cancel' : '+ Add Variant'}
                        </button>
                    </div>

                    {showAddVariant && (
                        <form onSubmit={handleAddVariant} className={`mb-8 p-6 rounded-xl border ${isDark ? 'bg-[#0a0a0a] border-[#333]' : 'bg-[#fafaf7] border-[#dcdchb]'}`}>
                            <h3 className="text-lg font-semibold mb-4">New Variant Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Variant Name (e.g. Red, XL)</label>
                                    <input required type="text" value={variantData.value} onChange={e => setVariantData({...variantData, value: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Stock</label>
                                    <input required type="number" min="0" value={variantData.stock} onChange={e => setVariantData({...variantData, stock: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Amount</label>
                                    <input required type="number" min="0" value={variantData.priceAmount} onChange={e => setVariantData({...variantData, priceAmount: e.target.value})} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Currency</label>
                                    <div className="relative">
                                        <div 
                                            onClick={() => setShowVariantCurrency(!showVariantCurrency)}
                                            className={`${inputClass} flex items-center justify-between cursor-pointer`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>
                                                    {currencies.find(c => c.code === variantData.priceCurrency)?.symbol}
                                                </span>
                                                <span className="font-semibold">{variantData.priceCurrency}</span>
                                            </span>
                                            <svg className={`w-4 h-4 opacity-50 transition-transform ${showVariantCurrency ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                        
                                        {showVariantCurrency && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setShowVariantCurrency(false)}></div>
                                                <div className={`absolute z-20 w-full mt-2 rounded-xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#e5e5df]'}`}>
                                                    {currencies.map(c => (
                                                        <div 
                                                            key={c.code}
                                                            onClick={() => { setVariantData({...variantData, priceCurrency: c.code}); setShowVariantCurrency(false); }}
                                                            className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                                                                variantData.priceCurrency === c.code 
                                                                    ? (isDark ? 'bg-[#333] text-white' : 'bg-[#f5f5ef] text-black') 
                                                                    : (isDark ? 'hover:bg-[#222]' : 'hover:bg-[#fafaf7]')
                                                            }`}
                                                        >
                                                            <span className={`w-5 text-center font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>{c.symbol}</span>
                                                            <span className="font-semibold">{c.code}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Variant Images</label>
                                <div className="flex flex-wrap gap-2">
                                    {variantPreviewUrls.map((url, i) => (
                                        <div key={i} className={`relative w-20 h-24 border rounded-lg overflow-hidden group ${isDark ? 'border-[#444]' : 'border-[#ccc]'}`}>
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button 
                                                type="button"
                                                onClick={() => removeVariantImage(i)} 
                                                className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {variantImages.length < 7 && (
                                        <label className={`w-20 h-24 border-2 border-dashed flex flex-col items-center justify-center rounded-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity ${isDark ? 'border-[#555] hover:border-white' : 'border-[#aaa] hover:border-black'}`}>
                                            <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                            <span className="text-[10px] font-medium">Add</span>
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={e => onAddVariantFiles(e.target.files)} />
                                        </label>
                                    )}
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isAddingVariant}
                                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold tracking-wide transition-colors ${
                                    isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                                } disabled:opacity-50`}
                            >
                                {isAddingVariant ? 'Saving...' : 'Save Variant'}
                            </button>
                        </form>
                    )}

                    {product.variants && product.variants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                           {product.variants.map((variant) => {
                            const isSelected = selectedVariant?._id === variant._id;
                            return (
                                    <div key={variant._id}
                                        onClick={() => setSelectedVariant(isSelected ? null : variant)}
                                        className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                                ? (isDark ? 'border-white bg-[#1a1a1a]' : 'border-black bg-[#f5f5ef]')
                                                : (isDark ? 'border-[#333] bg-[#161616] hover:border-[#555]' : 'border-[#e5e5df] bg-[#fafaf7] hover:border-[#aaa]')
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-bold text-lg">{variant.value}</h4>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteVariant(variant._id); }}
                                                    className="text-red-500 opacity-60 hover:opacity-100"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                            <div className={`text-sm mb-3 space-y-1 ${isDark ? 'text-[#aaa]' : 'text-[#666]'}`}>
                                                <p>Stock: <span className="font-medium text-current">{variant.stock}</span></p>
                                                <p>Price: <span className="font-medium text-current">{variant.price?.currency} {variant.price?.amount}</span></p>
                                            </div>
                                            {variant.image && variant.image.length > 0 && (
                    <div className="flex gap-2 mt-auto overflow-x-auto pb-1 scrollbar-hide">
                    {variant.image.map((img, i) => (
                        <img key={i} src={img.url} alt={variant.value} className="w-12 h-12 object-cover rounded border border-[#333]" />
                    ))}
                </div>
            )}
            {isSelected && (
                <span className={`mt-2 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-[#d4a017]' : 'text-[#a67c00]'}`}>Viewing: {variant.value}</span>
            )}
        </div>
    );
})}
                        </div>
                    ) : (
                        <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? 'border-[#333] text-[#666]' : 'border-[#ccc] text-[#888]'}`}>
                            <p>No variants added yet.</p>
                        </div>
                    )}
                </div>

                <div className={`mt-10 p-6 sm:p-8 rounded-2xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-6">Customer Reviews</h2>

                    {totalReviews > 0 ? (
                        <>
                            <div className={`flex flex-col sm:flex-row gap-6 sm:gap-10 mb-8 p-5 rounded-xl ${isDark ? 'bg-[#0f0f0f] border border-[#222]' : 'bg-[#fafaf7] border border-[#e5e5df]'}`}>
                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold">{(product.averageRating || 0).toFixed(1)}</span>
                                    <StaticStars rating={Math.round(product.averageRating || 0)} size="w-5 h-5" />
                                    <span className={`text-sm mt-1 ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>{totalReviews} reviews</span>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = distribution[star - 1];
                                        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-sm">
                                                <span className="w-3 text-right font-medium">{star}</span>
                                                <svg className="w-3.5 h-3.5 text-[#d4a017]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#222]' : 'bg-[#e5e5df]'}`}>
                                                    <div className="h-full bg-[#d4a017] rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className={`w-8 text-right text-xs ${isDark ? 'text-[#666]' : 'text-[#999]'}`}>{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* <div className="space-y-4">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className={`p-5 rounded-xl border ${isDark ? 'border-[#222] bg-[#0f0f0f]' : 'border-[#e5e5df] bg-[#fafaf7]'}`}>
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
                                            <StaticStars rating={review.rating} size="w-3.5 h-3.5" />
                                        </div>
                                        <p className={`pl-12 text-sm leading-relaxed ${isDark ? 'text-[#bbb]' : 'text-[#555]'}`}>
                                            {review.comment}
                                        </p>
                                    </div>
                                ))}
                            </div> */}
                        </>
                    ) : (
                        <div className={`p-10 rounded-xl text-center border border-dashed ${isDark ? 'border-[#333] text-[#555]' : 'border-[#ccc] text-[#888]'}`}>
                            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                            <p className="font-medium">No reviews yet</p>
                            <p className="text-sm opacity-60 mt-1">Reviews from buyers will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className={`relative w-full max-w-sm p-6 rounded-2xl border shadow-2xl ${isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-[#e0e0dc]'}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-red-950/30' : 'bg-red-50'}`}>
                                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Delete Product?</h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                                This will permanently delete <strong>"{product.title}"</strong> and all its reviews. This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#ddd] hover:bg-[#f5f5ef]'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OneProduct;