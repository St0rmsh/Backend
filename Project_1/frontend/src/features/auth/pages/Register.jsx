import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth"; // ✅ fixed path
import { useState } from "react";
import { useSelector } from "react-redux";

const Login = () => {

  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const { loading, error } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleLogin({
        email: form.email,
        password: form.password
      });

      navigate("/");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10">

        {/* LEFT - FORM */}
        <div className="w-full md:w-7/12 p-10 sm:p-14 flex flex-col justify-center bg-gray-900/50">

          <div className="w-full max-w-md mx-auto">

            <h3 className="text-3xl font-bold text-white mb-2">
              Welcome back
            </h3>

            <p className="text-gray-400 mb-6 text-sm">
              Please enter your details to sign in.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-300">Email or Username</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-300">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 mt-1 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] text-white rounded-xl transition-all"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* Footer */}
            <p className="text-gray-400 text-sm mt-6 text-center">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-white hover:text-blue-400"
              >
                Sign up
              </button>
            </p>

          </div>
        </div>

        {/* RIGHT - BRAND */}
        <div className="hidden md:flex w-5/12 p-10 flex-col justify-end bg-gradient-to-bl from-blue-600/20 to-purple-600/20 text-white">

          <h2 className="text-2xl font-bold mb-3">
            Unlock Your Potential
          </h2>

          <p className="text-gray-300 text-sm">
            Sign in to access your personalized dashboard and tools.
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;
