import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../features/auth/services/api.service";
import { setUser, setLoading, setError } from "../../../features/auth/state/auth.slice";

const LogoutButton = ({
  className = "",
  showConfirm = true,
  onSuccess,
}) => {
  const [confirm, setConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(setLoading(true));
    try {
      const data = await logoutUser();

      dispatch(setUser(null));

      // optional callback (for closing dropdown etc.)
      onSuccess?.();

      // redirect to home
      navigate("/");

    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
      setConfirm(false);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => {
          if (showConfirm) setConfirm(true);
          else handleLogout();
        }}
        className={`px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition ${className}`}
      >
        Logout
      </button>

      {/* CONFIRM MODAL */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
            <h2 className="text-lg font-semibold mb-3">
              Confirm Logout
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                No
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;



// buyer 

// hfukgfjqwgdwkgd@gmail.com
// Waterm@1oen
// Jon Doe