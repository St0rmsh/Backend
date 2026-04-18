import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BuyerRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.contact || (typeof user.contact === 'string' && user.contact.trim() === '')) {
        return <Navigate to="/complete-profile" replace />;
    }

    if (user.role === 'seller') {
        return <Navigate to="/seller" replace />;
    }

    return <Outlet />;
};

export default BuyerRoute;
