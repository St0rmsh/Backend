import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth/services/api.service";
import { setUser, setLoading as setAuthLoading, setError } from "../../../features/auth/state/auth.slice";
import { useTheme } from "../../../context/ThemeContext";

const LogoutButton = ({
  className = "",
  showConfirm = true,
  onSuccess,
}) => {
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 sm:p-0">
          {/* Backdrop with higher blur for focus */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => !loggingOut && setShowModal(false)}
          />

          {/* Modal Content - Perfect Center */}
          <div className={`relative w-full max-w-[400px] p-8 sm:p-10 rounded-[2rem] border shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ${
            isDark ? 'bg-[#111] border-[#333] text-white' : 'bg-white border-[#f0f0f0] text-[#1a1a1a]'
          }`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner ${
                isDark ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-500'
              }`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-black mb-3 tracking-tight">Sign Out?</h3>
              <p className={`text-sm mb-8 leading-relaxed font-medium ${isDark ? 'text-[#777]' : 'text-[#888]'}`}>
                Are you sure you want to end your current session? You'll need to enter your credentials to access your account again.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  disabled={loggingOut}
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3.5 rounded-2xl text-sm font-bold border transition-all active:scale-95 ${
                    isDark 
                      ? 'border-[#333] hover:bg-[#1a1a1a] text-[#aaa]' 
                      : 'border-[#eee] hover:bg-[#fafafa] text-[#666]'
                  } disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing…</span>
                    </>
                  ) : (
                    'Logout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;