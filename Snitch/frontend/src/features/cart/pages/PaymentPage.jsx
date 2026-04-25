import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useTheme } from '../../../context/ThemeContext';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

const PaymentPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
    });

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success
    const [orderId, setOrderId] = useState(null);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const items = cartItems.map(item => ({
                product: item.productId,
                variant: item.variantId?._id || item.variantId,
                quantity: item.quantity
            }));

            const res = await axios.post('/api/order/create', {
                items,
                shippingAddress: address
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                setOrderId(res.data.order._id);
                setStep(2);
            }
        } catch (error) {
            console.error("Order creation failed", error);
            alert(error.response?.data?.message || "Order creation failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/order/${orderId}/complete-payment`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                setStep(3);
                clearCart();
            }
        } catch (error) {
            console.error("Payment failed", error);
            alert(error.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = `w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${isDark ? 'bg-[#111] border-[#222] focus:border-[#444] text-white' : 'bg-white border-[#ddd] focus:border-[#999] text-black'}`;

    if (step === 3) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4ef] text-black'}`}>
                <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 shadow-xl shadow-green-500/20">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h1 className="text-3xl font-black italic mb-3 tracking-tight">ORDER PLACED!</h1>
                    <p className={`text-sm mb-8 opacity-60`}>Your order #{orderId?.slice(-6).toUpperCase()} has been confirmed and is being processed.</p>
                    <Link to="/products" className={`inline-block px-10 py-4 rounded-xl font-bold text-sm tracking-widest ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-[#f4f4ef] text-[#1a1a1a]'} font-sans`}>
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-[#0a0a0a]/95 border-[#1e1e1e]' : 'bg-[#f4f4ef]/95 border-[#ddd]'}`}>
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link to="/cart" className="text-xl font-black italic tracking-[-0.04em]">SNITCH</Link>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span className={step === 1 ? 'opacity-100 text-current' : ''}>Shipping</span>
                        <span>/</span>
                        <span className={step === 2 ? 'opacity-100 text-current' : ''}>Payment</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    <div className="flex-1">
                        {step === 1 ? (
                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <h2 className="text-xl font-black italic tracking-tight mb-6">SHIPPING ADDRESS</h2>
                                <div className="space-y-4">
                                    <input required placeholder="Street Address" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className={inputCls} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className={inputCls} />
                                        <input required placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className={inputCls} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="Zip Code" value={address.zipCode} onChange={e => setAddress({...address, zipCode: e.target.value})} className={inputCls} />
                                        <input required placeholder="Country" value={address.country} onChange={e => setAddress({...address, country: e.target.value})} className={inputCls} />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'} disabled:opacity-50`}>
                                    {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <h2 className="text-xl font-black italic tracking-tight mb-6">PAYMENT</h2>
                                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111] border-[#1e1e1e]' : 'bg-white border-[#e5e5df]'}`}>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex gap-2">
                                            <div className="w-10 h-6 bg-[#1a1a1a] rounded flex items-center justify-center text-[8px] font-bold text-white">VISA</div>
                                            <div className="w-10 h-6 bg-[#1a1a1a] rounded flex items-center justify-center text-[8px] font-bold text-white">MC</div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase opacity-40">Secure Payment</span>
                                    </div>
                                    <p className="text-sm mb-2 opacity-60 italic">Simulated Payment Gateway</p>
                                    <p className="text-xs mb-6 opacity-40">In a production environment, this would be integrated with Stripe, Razorpay, or PayPal.</p>
                                    <button onClick={handlePayment} disabled={loading} className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'} disabled:opacity-50`}>
                                        {loading ? 'PAYING...' : `PAY ${SYM[cartItems[0]?.price?.currency] || ''}${totalPrice.toLocaleString()}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[380px] shrink-0">
                        <div className={`p-6 rounded-2xl border sticky top-24 ${isDark ? 'bg-[#0e0e0e] border-[#1e1e1e]' : 'bg-white border-[#e5e5df] shadow-sm'}`}>
                            <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 opacity-40">Your Order</h3>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {cartItems.map(item => (
                                    <div key={`${item.productId}-${item.variantId?._id || item.variantId}`} className="flex gap-3">
                                        <div className={`w-12 h-14 rounded-lg overflow-hidden shrink-0 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f4f4ef]'}`}>
                                            <img src={item.images?.[0]?.url} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate">{item.title}</p>
                                            <p className="text-[10px] opacity-40 uppercase font-bold">{item.quantity} x {SYM[item.price?.currency] || ''}{item.price?.amount?.toLocaleString()}</p>
                                            {item.variantId && <p className="text-[9px] opacity-30 mt-0.5">VARIANT: {item.variantId.value || item.variantId}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-[#1e1e1e]' : 'border-[#eee]'}`}>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="opacity-40 uppercase">Total</span>
                                    <span className="text-lg">{SYM[cartItems[0]?.price?.currency] || ''}{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PaymentPage;
