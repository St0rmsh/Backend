import { useNavigate } from "react-router-dom";

const Login = () => {
  
 const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-4 font-sans">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/10">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-7/12 p-10 sm:p-14 flex flex-col justify-center bg-gray-900/50 order-2 md:order-1">
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-3xl font-bold text-white mb-2">Welcome back</h3>
            <p className="text-gray-400 mb-6 text-sm">Please enter your details to sign in.</p>

            <form className="space-y-4">
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
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
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white placeholder-gray-500 transition-all"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`w-full py-3 px-4 mt-6 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] cursor-pointer text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900`}
              >
                Sign in
              </button>
            </form>

            <div className="mt-8 text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-medium text-white hover:text-blue-400 transition-colors focus:outline-none focus:underline border-none bg-transparent cursor-pointer"
                >
                  Sign up now
                </button>
              </p>
            </div>
            
          </div>
        </div>

        {/* Right Side - Branding / Graphic */}
        <div className="w-full md:w-5/12 p-10 flex flex-col justify-between text-white relative overflow-hidden bg-linear-to-bl from-blue-600/20 to-purple-600/20 order-1 md:order-2">
          <div className="relative z-10 flex justify-end">
             {/* A subtle logo placeholder or icon */}
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
          </div>

          <div className="relative z-10 mt-auto text-right">
            <h2 className="text-3xl font-bold mb-4 tracking-tight text-white">Unlock Your Potential</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 ml-auto max-w-xs">
              Sign in to access personalized content, connect with your network, and manage your powerful tools seamlessly.
            </p>
          </div>
          
          {/* Decorative blurred circles background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 -translate-x-1/3 translate-y-1/3"></div>
        </div>

      </div>
    </div>
  );
};

export default Login;