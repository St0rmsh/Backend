import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';



const Register = () => {

  const navigate = useNavigate();

  const {handleRegister} = useAuth();


  const [formData , setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e)=>{
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e)=>{
  e.preventDefault();
  try {
    await handleRegister(formData);

    // 🔥 pass email to OTP page
    navigate("/verify-otp", { state: { email: formData.email } });

  } catch (error) {
    console.log(error);
  }
}



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-4 font-sans">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        {/* Left Side - Branding / Graphic */}
        <div className="w-full md:w-5/12 p-10 flex flex-col justify-between text-white relative overflow-hidden bg-linear-to-br from-blue-600/20 to-purple-600/20">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Join the Community</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Connect with friends, share your moments, and discover the world's best content all in one place.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="flex -space-x-4 mb-4">
              <img className="w-10 h-10 rounded-full border-2 border-gray-800" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
              <img className="w-10 h-10 rounded-full border-2 border-gray-800" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
              <img className="w-10 h-10 rounded-full border-2 border-gray-800" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
              <div className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-xs font-medium space-x-1">
                 <span>+99</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">Trusted by thousands of users worldwide.</p>
          </div>
          
          {/* Decorative blurred circles background */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-10 sm:p-14 flex flex-col justify-center bg-gray-900/50">
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-2">Create an account</h3>
            <p className="text-gray-400 mb-6 text-sm">Start your journey with us today.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start mt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-400">
                    I agree to the <a href="#" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`w-full py-3 px-4 mt-6 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer active:scale-[0.98] text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900`}
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-white hover:text-blue-400 transition-colors focus:outline-none focus:underline border-none bg-transparent cursor-pointer">
                  Sign in instead
                </button>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

