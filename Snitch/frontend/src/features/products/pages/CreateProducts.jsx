import React, { useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const CreateProducts = () => {
  const { handleCreateProduct } = useProduct();
  const { loading, error } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    stock: "",
  });

  
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showCurrency, setShowCurrency] = useState(false);

  const currencies = [
      { code: "INR", symbol: "₹", name: "Rupee" },
      { code: "USD", symbol: "$", name: "USD" },
      { code: "EUR", symbol: "€", name: "Euro" },
      { code: "GBP", symbol: "£", name: "Pound" },
      { code: "JPY", symbol: "¥", name: "Yen" }
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
        const newUrls = [...prev];
        URL.revokeObjectURL(newUrls[index]);
        return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.priceAmount) return;
    
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("priceAmount", formData.priceAmount);
    submitData.append("priceCurrency", formData.priceCurrency);
    submitData.append("stock", formData.stock);
    
    images.forEach(img => {
      submitData.append("images", img);
    });

    try {
      await handleCreateProduct(submitData);
      navigate("/seller");
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const inputClass = `w-full h-12 px-4 rounded-lg border outline-none transition-all ${
    isDark 
      ? 'bg-[#1a1a1a] border-[#333] text-white focus:border-[#666]' 
      : 'bg-white border-[#dcdchb] text-black focus:border-[#999]'
  }`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans flex justify-center`}>
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/seller" className={`p-2 rounded-full border ${isDark ? 'border-[#333] hover:bg-[#1a1a1a]' : 'border-[#dcdchb] hover:bg-white'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#8b8b8b]' : 'text-[#666]'}`}>List a new item in your catalog</p>
          </div>
        </div>

        {error && (
            <div className={`mb-6 p-4 rounded-lg font-medium border text-sm ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                {error.message || 'An error occurred'}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
            <h2 className="text-lg font-semibold mb-4">Basic Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-80">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className={inputClass}
                  placeholder="e.g. Minimalist Linen Shirt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 opacity-80">Description</label>
                <textarea 
                  required
                  rows="4" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className={`${inputClass} h-auto py-3 resize-none`}
                  placeholder="Describe your product in detail..."
                />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
            <h2 className="text-lg font-semibold mb-4">Pricing & Inventory</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5 opacity-80">Price Amount</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  value={formData.priceAmount} 
                  onChange={e => setFormData({...formData, priceAmount: e.target.value})}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium mb-1.5 opacity-80">Currency</label>
                <div className="relative">
                  <div 
                      onClick={() => setShowCurrency(!showCurrency)}
                      className={`${inputClass} flex items-center justify-between cursor-pointer`}
                  >
                      <span className="flex items-center gap-2">
                          <span className={`font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>
                              {currencies.find(c => c.code === formData.priceCurrency)?.symbol}
                          </span>
                          <span className="font-semibold">{formData.priceCurrency}</span>
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
                                      onClick={() => { setFormData({...formData, priceCurrency: c.code}); setShowCurrency(false); }}
                                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors ${
                                          formData.priceCurrency === c.code 
                                              ? (isDark ? 'bg-[#333] text-white' : 'bg-[#f5f5ef] text-black') 
                                              : (isDark ? 'hover:bg-[#222]' : 'hover:bg-[#fafaf7]')
                                      }`}
                                  >
                                      <span className={`w-5 text-center font-medium ${isDark ? 'text-[#888]' : 'text-[#999]'}`}>{c.symbol}</span>
                                      <span className="font-semibold">{c.code}</span>
                                      <span className={`text-xs ml-auto ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>{c.name}</span>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium mb-1.5 opacity-80">Base Stock</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  value={formData.stock} 
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className={inputClass}
                  placeholder="0"
                />
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
            <h2 className="text-lg font-semibold mb-4">Media</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg border border-[#333] relative overflow-hidden group">
                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute top-1.5 right-1.5 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                ))}
                {images.length < 7 && (
                    <label className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isDark ? 'border-[#444] hover:border-[#666] bg-[#1a1a1a]' : 'border-[#ccc] hover:border-[#aaa] bg-[#f9f9f9]'
                    }`}>
                        <svg className="w-6 h-6 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        <span className="text-xs font-medium opacity-70">Add Image</span>
                        <input type="file" required={images.length === 0} accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                    </label>
                )}
              </div>
              <p className="text-xs opacity-60">Upload up to 7 images. PNG, JPG or WEBP.</p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-12 flex items-center justify-center font-bold text-sm tracking-wide rounded-lg transition-transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark ? 'bg-white text-black hover:bg-[#e0e0e0]' : 'bg-black text-white hover:bg-[#222]'
              }`}
            >
              {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProducts;