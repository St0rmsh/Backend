import { useAuth } from "../hook/useAuth.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const VerifyOTP = () => {

  const { handleVerifyOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");

  // 🔥 Prevent access without email (refresh case)
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      await handleVerifyOTP({ email, otp });

      // ✅ after success
      navigate("/");

    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 relative overflow-hidden">

      {/* Background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10 relative z-10">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Verify your account
          </h2>
          <p className="text-gray-400 text-sm">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email (disabled) */}
          <div>
            <input
              value={email}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-center"
            />
          </div>

          {/* OTP */}
          <div>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              placeholder="------"
              className="w-full px-4 py-4 bg-gray-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-600 transition-all text-center text-2xl tracking-[1em] font-mono"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] text-white font-medium rounded-xl transition-all"
          >
            Verify Code
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Didn’t receive the code?{" "}
            <button
              type="button"
              className="text-blue-400 hover:underline"
              onClick={() => console.log("Resend OTP")}
            >
              Resend
            </button>
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-3 text-gray-500 hover:text-gray-300 text-xs"
          >
            ← Back to login
          </button>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;
