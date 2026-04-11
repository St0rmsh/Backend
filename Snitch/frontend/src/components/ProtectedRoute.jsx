import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to profile completion if contact is missing
    if (!user.contact || (typeof user.contact === 'string' && user.contact.trim() === '')) {
        return <Navigate to="/complete-profile" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
