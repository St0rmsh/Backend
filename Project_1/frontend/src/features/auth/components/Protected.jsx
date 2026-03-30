import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ children }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  // ⏳ Wait until auth is checked
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking auth...
      </div>
    );
  }

  // ❌ Only redirect AFTER check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default Protected;
