import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useOrder } from '../../products/hook/useOrder';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const STATUS_STYLES = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20' },
    processing: { label: 'Processing', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
    shipped: { label: 'Shipped', color: 'text-purple-600 bg-purple-500/10 border-purple-500/20' },
    delivered: { label: 'Delivered', color: 'text-green-600 bg-green-500/10 border-green-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-600 bg-red-500/10 border-red-500/20' },
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
    return (
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${style.color}`}>
            {style.label}
        </span>
    );
};

const OrderHistoryPage = () => {
    const { isDark } = useTheme();
    const { handleGetUserOrders, loading } = useOrder();
    const [orders, setOrders] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await handleGetUserOrders();
                setOrders(data);
            } catch (err) {
                setFetchError(err.message || 'Failed to load orders');
            }
        };
        load();
    }, [handleGetUserOrders]);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} font-sans`}>
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-[#e0e0db]'}`}>
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
                    <Link to="/products" className="text-2xl font-black italic tracking-tighter">SNITCH</Link>
                </div>
            </nav>

            <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-8">My Orders</h1>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-28 rounded-2xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-[#e8e8e4]'}`} />
                        ))}
                    </div>
                ) : fetchError ? (
                    <div className={`p-6 rounded-2xl border text-sm ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        {fetchError}
                    </div>
                ) : orders.length === 0 ? (
                    <div className={`p-16 text-center rounded-[32px] border border-dashed ${isDark ? 'border-[#1e1e1e] bg-[#0e0e0e]' : 'border-[#e5e5df] bg-white'}`}>
                        <p className="text-lg font-bold mb-2">No orders yet</p>
                        <p className="text-sm opacity-50 mb-6">When you place an order, it'll show up here.</p>
                        <Link to="/products" className={`inline-block px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const sym = SYM[order.currency] || '₹';
                            return (
                                <Link
                                    key={order._id}
                                    to={`/orders/${order._id}`}
                                    className={`block p-6 rounded-2xl border transition-all ${isDark ? 'bg-[#111] border-[#1e1e1e] hover:border-[#333]' : 'bg-white border-[#e5e5df] hover:shadow-lg'}`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-sm font-semibold">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <StatusBadge status={order.orderStatus} />
                                    </div>

                                    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                                        {order.items.slice(0, 4).map((item, i) => (
                                            <div key={i} className={`w-14 h-16 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-[#fafaf7] border-[#eee]'}`}>
                                                <img
                                                    src={item.product?.images?.[0]?.url || 'https://placehold.co/200x250?text=No+Image'}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <span className="text-xs font-bold opacity-40 shrink-0">+{order.items.length - 4} more</span>
                                        )}
                                    </div>

                                    <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                        <span className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''} · Payment: {order.paymentStatus}
                                        </span>
                                        <span className="text-lg font-black tracking-tight">
                                            {sym}{order.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default OrderHistoryPage;