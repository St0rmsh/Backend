import React, { useState, useRef, useEffect } from 'react';

const SearchSort = ({ 
    search, 
    setSearch, 
    sortBy, 
    setSortBy, 
    isDark,
    resultsCount
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { label: 'NEWEST FIRST', value: 'newest' },
        { label: 'TOP RATED', value: 'rating' },
        { label: 'MOST REVIEWED', value: 'reviews' },
        { label: 'PRICE: LOW TO HIGH', value: 'priceLow' },
        { label: 'PRICE: HIGH TO LOW', value: 'priceHigh' }
    ];

    const currentLabel = options.find(opt => opt.value === sortBy)?.label || 'SORT BY';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="w-full space-y-4 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                
                {/* Search Input */}
                <div className="w-full md:max-w-md relative group">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-opacity ${isDark ? 'opacity-30 group-focus-within:opacity-100' : 'opacity-40 group-focus-within:opacity-100'}`}>
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for your next favorite catch…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`w-full h-[48px] pl-11 pr-5 rounded-2xl text-sm font-medium border outline-none transition-all
                            ${isDark 
                                ? 'bg-[#111] border-[#1e1e1e] text-white placeholder-[#333] focus:border-[#444] focus:bg-[#141414]' 
                                : 'bg-white border-[#e5e5df] text-black placeholder-[#aaa] focus:border-[#ccc] focus:shadow-sm'
                            }`}
                    />
                </div>

                {/* Sort and Count */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    
                    {/* Results Count */}
                    <div className="hidden lg:block">
                        <span className={`text-[11px] font-black tracking-[0.15em] uppercase opacity-30`}>
                            {resultsCount} PRODUCT{resultsCount !== 1 ? 'S' : ''} FOUND
                        </span>
                    </div>

                    {/* Custom Dropdown */}
                    <div className="relative w-full md:w-[200px]" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-full h-[48px] px-5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98]
                                ${isDark 
                                    ? 'bg-[#111] border-[#1e1e1e] text-white hover:bg-[#141414]' 
                                    : 'bg-white border-[#e5e5df] text-black hover:bg-[#fafaf8]'
                                }`}
                        >
                            <span className="text-[11px] font-black tracking-widest uppercase truncate">{currentLabel}</span>
                            <svg 
                                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-30`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`absolute top-[calc(100%+8px)] right-0 w-full min-w-[200px] z-50 rounded-2xl border overflow-hidden transition-all duration-200 origin-top
                            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                            ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e] shadow-2xl' : 'bg-white border-[#e5e5df] shadow-xl text-black'}
                        `}>
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSortBy(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-5 py-3.5 text-left text-[11px] font-black tracking-widest uppercase transition-colors
                                        ${sortBy === option.value 
                                            ? (isDark ? 'bg-white text-black' : 'bg-[#1a1a1a] text-white') 
                                            : (isDark ? 'hover:bg-[#161616] text-[#666]' : 'hover:bg-[#f5f5ef] text-[#999]')
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
            </div>
            
            {/* Active Filters / Chips could go here */}
        </div>
    );
};

export default SearchSort;
