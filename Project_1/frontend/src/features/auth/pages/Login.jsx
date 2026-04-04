import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth.js";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { loading } = useSelector((state) => state.auth);

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
    if (!form.email || !form.password) return;

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden border border-white/10"
      >
        {/* Left Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center order-2 md:order-1 relative z-10">
          <div className="w-full max-w-md mx-auto">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
            >
              Welcome Back
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mb-8"
            >
              Please enter your details to sign in and continue.
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                <div className="mt-1 relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="relative w-full px-5 py-3.5 bg-gray-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all hover:bg-gray-900/80"
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <div className="mt-1 relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="relative w-full px-5 py-3.5 bg-gray-900/50 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all hover:bg-gray-900/80"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center justify-between text-sm mt-2"
              >
                <label className="flex items-center text-gray-400 cursor-pointer hover:text-white transition">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 mr-2 bg-gray-800 text-blue-500 focus:ring-blue-500" />
                  Remember me
                </label>
                <a href="#" className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </form>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-400 text-sm mt-8 text-center"
            >
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-purple-400 font-medium hover:text-purple-300 hover:underline transition-all"
              >
                Sign up now
              </button>
            </motion.p>
          </div>
        </div>

        {/* Right Graphic */}
        <div className="w-full md:w-5/12 p-10 flex flex-col justify-center items-center relative overflow-hidden order-1 md:order-2 bg-gray-900/40 border-l border-white/5">
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30" style={{animation: "pulse 3.5s infinite reverse"}}></div>
          </div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="w-24 h-24 mx-auto bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Secure Access</h2>
            <p className="text-gray-300 text-sm max-w-[250px] mx-auto leading-relaxed">
              Log in to manage your professional presence and engage with creators.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;