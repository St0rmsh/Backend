import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const ViewProducts = () => {
  const { handleGetAllProducts } = useProduct();
  const sellerProducts = useSelector(state => state?.product?.products || []);
  const { loading } = useSelector(state => state.product);
  const { isDark } = useTheme();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f5f5ef] text-[#1a1a1a]'} px-6 py-10 lg:px-12 transition-colors duration-300 font-sans`}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-[#333333] border-opacity-20 dark:border-opacity-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Products</h1>
          <p className={`text-sm ${isDark ? 'text-[#8b8b8b]' : 'text-[#5a5a5a]'}`}>Manage your catalog and inventory</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">

          <Link 
            to="/seller/orders" 
            className={`flex items-center justify-center h-10 px-5 font-semibold text-sm rounded-lg border transition-colors ${isDark ? 'border-[#444] hover:bg-[#1a1a1a]' : 'border-[#ccc] hover:bg-white'}`}
          >
            Orders
          </Link>

          <Link 
            to="/seller/reviews" 
            className={`flex items-center justify-center h-10 px-5 font-semibold text-sm rounded-lg border transition-colors ${isDark ? 'border-[#444] hover:bg-[#1a1a1a]' : 'border-[#ccc] hover:bg-white'}`}
          >
            Reviews
          </Link>
            <Link 
            to="/seller/analytics" 
            className={`flex items-center justify-center h-10 px-5 font-semibold text-sm rounded-lg border transition-colors ${isDark ? 'border-[#444] hover:bg-[#1a1a1a]' : 'border-[#ccc] hover:bg-white'}`}
          >
            Analytics
          </Link>
          <Link 
            to="/seller/create" 
            className="flex items-center justify-center h-10 px-6 font-semibold text-sm bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#e0e0e0] transition-colors"
          >
            + Add New Product
          </Link>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(idx => (
            <div key={idx} className={`animate-pulse rounded-xl h-80 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#ebebea]'}`}></div>
          ))}
        </div>
      ) : sellerProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e0e0d5]'}`}>
             <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">No products yet</h2>
          <p className={`mb-6 max-w-md ${isDark ? 'text-[#8b8b8b]' : 'text-[#5a5a5a]'}`}>You haven't listed any items for sale. To start building your catalog, add your first product now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
          {sellerProducts.map(product => {
            return (
              <Link 
                key={product._id} 
                to={`/seller/${product._id}`}
                className={`group flex flex-col bg-white dark:bg-[#121212] border transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden
                  ${isDark ? 'border-[#2a2a2a] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:border-[#444]' : 'border-[#e5e5e5] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#ccc]'}`}
              >
                <div className="relative aspect-[4/5] w-full bg-[#f8f8f8] dark:bg-[#1a1a1a] overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  
                  <h3 className={`font-medium text-[15px] leading-snug line-clamp-2 mb-2 transition-colors ${isDark ? 'text-[#e0e0e0] group-hover:text-white' : 'text-[#333] group-hover:text-black'}`}>
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex text-[#111] dark:text-[#eee]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    </div>
                    <span className="text-[13px] font-bold">{product.averageRating?.toFixed(1) || "0.0"}</span>
                    <span className="text-[12px] opacity-60">({product.numReviews || 0} reviews)</span>
                  </div>

                  
                  <div className="mt-auto flex items-end gap-1">
                    <span className={`text-[12px] font-medium mb-[3px] ${isDark ? 'text-[#888]' : 'text-[#666]'}`}>
                      {product.price?.currency === "INR" ? "₹" : product.price?.currency}
                    </span>
                    <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                      {product.price?.amount}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}

export default ViewProducts;