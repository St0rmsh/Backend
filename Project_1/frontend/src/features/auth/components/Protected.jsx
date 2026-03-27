import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // ⏳ While checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // 🔒 If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Authorized
  return children;
};

export default Protected;
