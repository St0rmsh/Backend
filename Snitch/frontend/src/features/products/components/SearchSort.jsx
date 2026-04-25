import React, { useState, useRef, useEffect } from 'react';

const SearchSort = ({ 
    search, 
    setSearch, 
    sortBy, 
    setSortBy, 
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    isDark,
    resultsCount,
    loading
}) => {
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const sortRef = useRef(null);
    const filterRef = useRef(null);

    const sortOptions = [
        { label: 'NEWEST FIRST', value: 'newest' },
        { label: 'TOP RATED', value: 'rating' },
        { label: 'PRICE: LOW TO HIGH', value: 'price_low' },
        { label: 'PRICE: HIGH TO LOW', value: 'price_high' }
    ];

    const categories = ['All', 'Clothing', 'Footwear', 'Accessories', 'Electronics', 'Lifestyle'];

    const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'SORT BY';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) setIsSortOpen(false);
            if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full space-y-4 mb-8">
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
                
                {/* Real Search Bar */}
                <div className="flex-1 relative group">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${isDark ? 'group-focus-within:text-white text-[#444]' : 'group-focus-within:text-black text-[#999]'}`}>
                        <svg className={`w-[18px] h-[18px] transition-transform duration-300 ${loading ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center pl-4">
                                <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${isDark ? 'border-white' : 'border-black'}`} />
                            </div>
                        )}
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Search for items, brands and more..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full h-[56px] pl-12 pr-12 rounded-2xl text-sm font-semibold border outline-none transition-all duration-300
                            ${isDark 
                                ? 'bg-[#111] border-[#1e1e1e] text-white focus:border-[#444] focus:bg-[#161616] placeholder-[#333]' 
                                : 'bg-white border-[#e5e5df] text-black focus:border-[#ccc] focus:bg-[#fafaf8] placeholder-[#bbb]'
                            } shadow-sm focus:shadow-xl`}
                    />

                    {/* Clear Button */}
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110 active:scale-90
                                ${isDark ? 'text-[#444] hover:text-white' : 'text-[#999] hover:text-black'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter */}
                    <div className="flex bg-transparent overflow-x-auto scrollbar-hide gap-2 p-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border transition-all duration-300 whitespace-nowrap
                                    ${category === cat 
                                        ? (isDark ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-black text-white border-black shadow-xl') 
                                        : (isDark ? 'bg-transparent border-[#1e1e1e] text-[#555] hover:border-[#444] hover:text-[#888]' : 'bg-white border-[#e5e5df] text-[#999] hover:border-[#aaa] hover:text-[#555]')
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="h-10 w-[1px] bg-current opacity-5 hidden md:block" />

                    {/* Price Filter Toggle */}
                    <div className="relative" ref={filterRef}>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`h-[56px] px-6 rounded-2xl border flex items-center gap-3 transition-all duration-300 shadow-sm hover:shadow-md
                                ${isDark ? 'bg-[#111] border-[#1e1e1e] hover:bg-[#161616] text-[#888] hover:text-white' : 'bg-white border-[#e5e5df] hover:bg-[#fafaf8] text-[#666] hover:text-black'}`}
                        >
                            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span className="text-[11px] font-black tracking-widest uppercase">Price</span>
                        </button>
                        
                        {isFilterOpen && (
                            <div className={`absolute top-[calc(100%+12px)] right-0 w-72 p-6 z-50 rounded-3xl border shadow-2xl animate-in fade-in zoom-in duration-300
                                ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                                <div className="flex items-center justify-between mb-5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-30">Price Range</h4>
                                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline">Reset</button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="text-[9px] font-bold uppercase opacity-20 mb-1 ml-1">Min</div>
                                        <input 
                                            type="number" placeholder="0" value={minPrice} 
                                            onChange={e => setMinPrice(e.target.value)}
                                            className={`w-full h-11 px-4 rounded-xl border text-xs font-bold outline-none transition-all ${isDark ? 'bg-[#161616] border-[#222] focus:border-[#444]' : 'bg-[#f9f9f9] border-[#eee] focus:border-[#ccc]'}`}
                                        />
                                    </div>
                                    <div className="mt-4 opacity-10 text-xl font-light">-</div>
                                    <div className="flex-1">
                                        <div className="text-[9px] font-bold uppercase opacity-20 mb-1 ml-1">Max</div>
                                        <input 
                                            type="number" placeholder="Any" value={maxPrice} 
                                            onChange={e => setMaxPrice(e.target.value)}
                                            className={`w-full h-11 px-4 rounded-xl border text-xs font-bold outline-none transition-all ${isDark ? 'bg-[#161616] border-[#222] focus:border-[#444]' : 'bg-[#f9f9f9] border-[#eee] focus:border-[#ccc]'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative" ref={sortRef}>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className={`h-[56px] px-6 rounded-2xl border flex items-center justify-between gap-6 transition-all duration-300 shadow-sm hover:shadow-md
                                ${isDark ? 'bg-[#111] border-[#1e1e1e] hover:bg-[#161616] text-[#888] hover:text-white' : 'bg-white border-[#e5e5df] hover:bg-[#fafaf8] text-[#666] hover:text-black'}`}
                        >
                            <span className="text-[11px] font-black tracking-widest uppercase whitespace-nowrap">{currentSortLabel}</span>
                            <svg className={`w-4 h-4 transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''} opacity-30`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        <div className={`absolute top-[calc(100%+12px)] right-0 w-64 z-50 rounded-3xl border overflow-hidden transition-all duration-300 origin-top shadow-2xl
                            ${isSortOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                            ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] text-black'}
                        `}>
                            <div className="p-2">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                                        className={`w-full px-5 py-4 text-left text-[11px] font-black tracking-widest uppercase rounded-2xl transition-all duration-200
                                            ${sortBy === opt.value 
                                                ? (isDark ? 'bg-white text-black shadow-lg translate-x-1' : 'bg-black text-white shadow-lg translate-x-1') 
                                                : (isDark ? 'hover:bg-[#161616] text-[#555] hover:text-white' : 'hover:bg-[#f5f5ef] text-[#999] hover:text-black')
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-current border-opacity-5 pt-5 gap-4">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black tracking-[0.25em] uppercase opacity-20`}>
                        {resultsCount} Results Found
                    </span>
                    {loading && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-current bg-opacity-5 animate-pulse">
                            <div className={`w-1 h-1 rounded-full animate-bounce ${isDark ? 'bg-white' : 'bg-black'}`} />
                            <div className={`w-1 h-1 rounded-full animate-bounce [animation-delay:-.3s] ${isDark ? 'bg-white' : 'bg-black'}`} />
                            <div className={`w-1 h-1 rounded-full animate-bounce [animation-delay:-.5s] ${isDark ? 'bg-white' : 'bg-black'}`} />
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    {category !== 'All' && (
                        <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-[#d4a017] text-white animate-in slide-in-from-right-4 duration-500 shadow-lg shadow-[#d4a017]/20 uppercase tracking-widest">
                            {category}
                        </span>
                    )}
                    {(minPrice || maxPrice) && (
                        <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-blue-500 text-white animate-in slide-in-from-right-4 duration-500 shadow-lg shadow-blue-500/20 uppercase tracking-widest">
                            Price: {minPrice || 0} - {maxPrice || '∞'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchSort;
