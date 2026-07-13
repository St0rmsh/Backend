import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Wraps buyer-facing routes (Products, Cart, Wishlist, Payment, Orders, etc).
// If a logged-in seller lands here, redirect them to their seller dashboard
// instead of letting them browse as a buyer. Non-sellers (buyers, guests)
// pass through normally via <Outlet />.
const IsSeller = () => {
    const user = useSelector(state => state.auth.user);

    <div>Shopstream</div>

    if (user?.role === 'seller') {
        return <Navigate to="/seller" replace />;
    }

    return <Outlet />;
};

export default IsSeller;

//  <span className={`text-[13px] font-semibold px-4 py-2 rounded-full ${isDark ? 'bg-[#1a1a1a] text-[#aaa]' : 'bg-[#e8e8e0] text-[#555]'}`}>
//                 Hi, {user.fullname?.split(' ')[0]}
//               </span>

// sujitku5619@gmail.com
// Stormshad@1