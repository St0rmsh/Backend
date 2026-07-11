import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useOrder } from '../hook/useOrder';

const SellerAnalyticsPage = () => {
    const { isDark } = useTheme();
    const { handleGetSellerAnalytics, loading } = useOrder();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        handleGetSellerAnalytics().then(setAnalytics).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} px-6 py-10 lg:px-12 font-sans`}>
            <header className="flex items-center gap-4 mb-8">
                <Link to="/seller" className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </Link>
                <h1 className="text-3xl font-black italic tracking-tighter">ANALYTICS</h1>
            </header>

            {loading || !analytics ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-28 rounded-2xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-[#e8e8e4]'}`} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-4xl">
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">This Week</p>
                            <p className="text-3xl font-black tracking-tight">₹{analytics.weekRevenue?.toLocaleString()}</p>
                            <p className="text-xs opacity-50 mt-1">{analytics.weekOrders} order{analytics.weekOrders !== 1 ? 's' : ''}</p>
                        </div>
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">This Month</p>
                            <p className="text-3xl font-black tracking-tight">₹{analytics.monthRevenue?.toLocaleString()}</p>
                            <p className="text-xs opacity-50 mt-1">{analytics.monthOrders} order{analytics.monthOrders !== 1 ? 's' : ''}</p>
                        </div>
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">All Time</p>
                            <p className="text-3xl font-black tracking-tight">₹{analytics.allTimeRevenue?.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border max-w-4xl ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                        <h2 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">Top Products</h2>
                        {analytics.topProducts?.length === 0 ? (
                            <p className="text-sm opacity-50">No sales yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.topProducts?.map((p, i) => (
                                    <div key={p._id} className={`flex items-center justify-between py-3 ${i > 0 ? `border-t ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}` : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black opacity-20">{i + 1}</span>
                                            <span className="text-sm font-semibold">{p.title}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{p.unitsSold} sold</p>
                                            <p className="text-xs opacity-40">₹{p.revenue?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SellerAnalyticsPage;