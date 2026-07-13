import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useOrder } from '../../products/hook/useOrder';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const StatusTimeline = ({ currentStatus, isDark }) => {
    if (currentStatus === 'cancelled') {
        return (
            <div className={`p-4 rounded-xl border text-center text-sm font-bold ${isDark ? 'bg-red-900/20 border-red-800/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                This order was cancelled.
            </div>
        );
    }

    const currentIdx = STATUS_STEPS.indexOf(currentStatus);

    return (
        <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentIdx;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isDone
                                    ? (isDark ? 'bg-white border-white text-black' : 'bg-black border-black text-white')
                                    : (isDark ? 'border-[#333] text-[#444]' : 'border-[#ddd] text-[#ccc]')
                            }`}>
                                {isDone ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                ) : (
                                    <span className="text-xs font-bold">{i + 1}</span>
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isDone ? '' : 'opacity-30'}`}>
                                {step}
                            </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < currentIdx ? (isDark ? 'bg-white' : 'bg-black') : (isDark ? 'bg-[#222]' : 'bg-[#eee]')}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const { isDark } = useTheme();
    const { handleGetOrderById, loading } = useOrder();
    const [order, setOrder] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await handleGetOrderById(id);
                setOrder(data);
            } catch (err) {
                setFetchError(err.message || 'Failed to load order');
            }
        };
        if (id) load();
    }, [id, handleGetOrderById]);

    if (loading && !order) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f4f4ef]'}`}>
                <div className="w-10 h-10 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />
            </div>
        );
    }

    if (fetchError || !order) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4ef] text-black'}`}>
                <h1 className="text-xl font-bold">{fetchError || 'Order not found'}</h1>
                <Link to="/orders" className="text-sm underline opacity-60 hover:opacity-100">Back to Orders</Link>
            </div>
        );
    }

    const sym = SYM[order.currency] || '₹';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#eee]' : 'bg-[#f5f5f0] text-[#111]'} font-sans`}>
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1a1a1a]' : 'bg-[#f5f5f0]/95 border-[#e0e0db]'}`}>
                <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
                    <Link to="/products" className="text-2xl font-black italic tracking-tighter">SHOPSTREAM</Link>
                    <Link to="/orders" className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border ${isDark ? 'border-[#1e1e1e] hover:bg-[#111]' : 'border-[#e5e5df] hover:bg-white'}`}>
                        All Orders
                    </Link>
                </div>
            </nav>

            <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </h1>
                </div>

                <div className={`p-6 rounded-2xl border mb-6 ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                    <StatusTimeline currentStatus={order.orderStatus} isDark={isDark} />
                </div>

                <div className={`p-6 rounded-2xl border mb-6 ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                    <h2 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className={`w-16 h-20 rounded-lg overflow-hidden shrink-0 border ${isDark ? 'bg-[#0a0a0a] border-[#1e1e1e]' : 'bg-[#fafaf7] border-[#eee]'}`}>
                                    <img
                                        src={item.product?.images?.[0]?.url || 'https://placehold.co/200x250?text=No+Image'}
                                        alt={item.productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{item.productName}</p>
                                    {item.variantName && (
                                        <span className="inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded bg-[#d4a017] text-white uppercase tracking-widest">
                                            {item.variantName}
                                        </span>
                                    )}
                                    <p className="text-xs opacity-50 mt-1">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-sm">{sym}{(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                    <p className="text-[10px] opacity-40">{sym}{item.priceAtPurchase.toLocaleString()} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                        <h2 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">Shipping Address</h2>
                        <div className="text-sm space-y-1 opacity-80">
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                            <p>{order.shippingAddress?.zipCode}</p>
                            <p>{order.shippingAddress?.country}</p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                        <h2 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">Payment Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between opacity-70">
                                <span>Subtotal</span>
                                <span>{sym}{order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between opacity-70">
                                <span>Tax</span>
                                <span>{sym}{order.tax?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between opacity-70">
                                <span>Shipping</span>
                                <span>{sym}{order.shipping?.toLocaleString()}</span>
                            </div>
                            <div className={`flex justify-between pt-2 border-t font-black text-base ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                <span>Total</span>
                                <span>{sym}{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 pt-2">
                                Payment: {order.paymentStatus}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetailPage;