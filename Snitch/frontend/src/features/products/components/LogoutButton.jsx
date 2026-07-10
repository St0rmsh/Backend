import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth/services/api.service";
import { setUser, setLoading as setAuthLoading, setError } from "../../../features/auth/state/auth.slice";
import { useTheme } from "../../../context/ThemeContext";

const LogoutButton = ({className = "",showConfirm = true,onSuccess,}) => {
  const [showModal, setShowModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    dispatch(setAuthLoading(true));
    try {
      await logoutUser();
      dispatch(setUser(null));
      onSuccess?.();
      navigate("/");
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setAuthLoading(false));
      setLoggingOut(false);
      setShowModal(false);
    }
  }, [dispatch, navigate, onSuccess]);

  const btnClasses = `flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
    isDark 
      ? 'text-red-400 hover:bg-red-500/10 active:bg-red-500/20' 
      : 'text-red-600 hover:bg-red-50 active:bg-red-100'
  } ${className}`;

  return (
    <>
      <button
        onClick={() => (showConfirm ? setShowModal(true) : handleLogout())}
        className={btnClasses}
      >
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>

     {showModal && (
  <div className="fixed inset-0 z-[99999] grid place-items-center p-6">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-md"
      onClick={() => !loggingOut && setShowModal(false)}
    />

    {/* Modal */}
    <div
      className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl ${
        isDark
          ? "bg-[#111111] border-[#2b2b2b] text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      {/* Icon */}
      <div className="flex justify-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            isDark
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-red-50 border border-red-100"
          }`}
        >
          <svg
            className="h-9 w-9 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold">Sign Out</h2>

        <p
          className={`mt-3 text-sm leading-6 ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Are you sure you want to sign out?
          <br />
          You'll need to sign in again to access your account.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          disabled={loggingOut}
          onClick={() => setShowModal(false)}
          className={`min-w-[140px] rounded-xl border px-6 py-3 font-semibold transition-all duration-200 ${
            isDark
              ? "border-gray-700 hover:bg-[#1b1b1b]"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          Cancel
        </button>

        <button
          disabled={loggingOut}
          onClick={handleLogout}
          className="min-w-[140px] rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 flex items-center justify-center gap-2"
        >
          {loggingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing Out...
            </>
          ) : (
            "Sign Out"
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default LogoutButton;