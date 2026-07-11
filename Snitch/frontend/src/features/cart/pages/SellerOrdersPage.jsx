import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useOrder } from '../../products/hook/useOrder';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_STYLES = {
    pending: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
    processing: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    shipped: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
    delivered: 'text-green-600 bg-green-500/10 border-green-500/20',
    cancelled: 'text-red-600 bg-red-500/10 border-red-500/20',
};

const SellerOrdersPage = () => {
    const { isDark } = useTheme();
    const { handleGetSellerOrders, handleUpdateOrderStatus, loading } = useOrder();
    const [orders, setOrders] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const loadOrders = async () => {
        try {
            const data = await handleGetSellerOrders();
            setOrders(data);
        } catch (err) {
            setFetchError(err.message || 'Failed to load orders');
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAdvanceStatus = async (order) => {
        const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
        const nextStatus = STATUS_FLOW[currentIdx + 1];
        if (!nextStatus) return;

        setUpdatingId(order._id);
        try {
            await handleUpdateOrderStatus(order._id, nextStatus);
            setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: nextStatus } : o));
        } catch (err) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} px-6 py-10 lg:px-12 font-sans`}>
            <header className="flex items-center gap-4 mb-8">
                <Link to="/seller" className={`p-2.5 rounded-2xl border transition-all active:scale-95 ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                </Link>
                <h1 className="text-3xl font-black italic tracking-tighter">ORDERS</h1>
            </header>

            {loading && orders.length === 0 ? (
                <div className="space-y-4 max-w-4xl">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-32 rounded-2xl animate-pulse ${isDark ? 'bg-[#111]' : 'bg-[#e8e8e4]'}`} />
                    ))}
                </div>
            ) : fetchError ? (
                <div className={`p-6 rounded-2xl border text-sm max-w-4xl ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                    {fetchError}
                </div>
            ) : orders.length === 0 ? (
                <div className={`p-16 text-center rounded-[32px] border border-dashed max-w-4xl ${isDark ? 'border-[#1e1e1e] bg-[#0e0e0e]' : 'border-[#e5e5df] bg-white'}`}>
                    <p className="text-lg font-bold mb-2">No orders yet</p>
                    <p className="text-sm opacity-50">Orders containing your products will show up here.</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl">
                    {orders.map(order => {
                        const sym = SYM[order.currency] || '₹';
                        const statusStyle = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.pending;
                        const currentIdx = STATUS_FLOW.indexOf(order.orderStatus);
                        const nextStatus = STATUS_FLOW[currentIdx + 1];
                        const canAdvance = order.orderStatus !== 'cancelled' && nextStatus;

                        return (
                            <div key={order._id} className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
                                            Order #{order._id.slice(-8).toUpperCase()} · {order.user?.fullname || 'Buyer'}
                                        </p>
                                        <p className="text-sm font-semibold">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border w-fit ${statusStyle}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="opacity-70 truncate pr-4">
                                                {item.productName}{item.variantName ? ` — ${item.variantName}` : ''} × {item.quantity}
                                            </span>
                                            <span className="font-bold shrink-0">{sym}{(item.priceAtPurchase * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                        Payment: {order.paymentStatus}
                                    </span>
                                    {canAdvance ? (
                                        <button
                                            onClick={() => handleAdvanceStatus(order)}
                                            disabled={updatingId === order._id}
                                            className={`text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                                        >
                                            {updatingId === order._id ? 'Updating…' : `Mark as ${nextStatus}`}
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold opacity-30 uppercase tracking-widest">
                                            {order.orderStatus === 'delivered' ? 'Completed' : order.orderStatus === 'cancelled' ? '—' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SellerOrdersPage;