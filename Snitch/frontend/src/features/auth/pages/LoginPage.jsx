import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';

/* ── Icons ───────────────────────────────────────────────── */
const EyeOpen = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeClosed = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

/* ── Feature pills ───────────────────────────────────────── */
const FEATURES = ['🚚 Free Delivery', '🔄 Easy Returns', '🔒 Secure Pay'];

/* ── Input class helper ──────────────────────────────────── */
const inputCls = (hasError) =>
  `w-full h-12 bg-white dark:bg-white/5 border rounded-xl px-4 text-sm
   text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
   focus:outline-none focus:ring-2 transition-all duration-200
   ${hasError
    ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
    : 'border-slate-200 dark:border-white/10 focus:border-violet-500 focus:ring-violet-500/20'
  }`;

/* ════════════════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════════════════ */
const LoginPage = () => {
  const { handleLogin, user, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState('');

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setServerErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }

    const result = await handleLogin({ email: form.email, password: form.password });
    if (result.success) navigate('/', { replace: true });
    else setServerErr(result.error || 'Invalid email or password.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b14] transition-colors duration-300">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -right-40 w-[500px] h-[500px] bg-violet-400/8 dark:bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] bg-indigo-400/8 dark:bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg
            bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15
            text-slate-600 dark:text-slate-300
            hover:scale-110 hover:border-violet-400 dark:hover:border-violet-400
            transition-all duration-200"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      {/* Two-column layout on lg+ */}
      <div className="relative z-10 flex min-h-screen">

        {/* ── Left panel: branding (hidden on mobile) ────────── */}
        <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0
          bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700
          dark:from-violet-900 dark:via-violet-800 dark:to-indigo-900
          p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

          {/* Logo */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-white font-black text-2xl leading-none">S</span>
              </div>
              <span className="text-3xl font-black text-white tracking-tight">Snitch</span>
            </div>
          </div>

          {/* Hero copy */}
          <div className="relative space-y-6">
            <div>
              <h2 className="text-4xl font-black text-white leading-tight">
                Shop the <br />
                <span className="text-violet-200">latest trends.</span>
              </h2>
              <p className="mt-3 text-violet-200 text-base leading-relaxed">
                Discover fresh drops, exclusive styles, and everything fashion — all in one place.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {[
                { icon: '🚚', text: 'Free delivery on orders above ₹499' },
                { icon: '🔄', text: 'Easy 15-day returns, no questions asked' },
                { icon: '🔒', text: 'Secured payments & buyer protection' },
                { icon: '✨', text: 'New arrivals every week' },
              ].map((f) => (
                <li key={f.text} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 leading-none shrink-0">{f.icon}</span>
                  <span className="text-sm text-violet-100">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom tagline */}
          <p className="relative text-xs text-violet-300">© 2026 Snitch. Crafted with ❤️</p>
        </div>

        {/* ── Right panel: login form ───────────────────────── */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white font-black text-xl leading-none">S</span>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Snitch</span>
            </div>

            {/* Card */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl
              border border-slate-200 dark:border-white/10
              rounded-2xl shadow-xl dark:shadow-black/30 p-6 sm:p-8">

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back 👋</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your Snitch account</p>
              </div>

              {/* Server error */}
              {serverErr && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  {serverErr}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    id="email" name="email" type="email"
                    autoComplete="email" placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                    className={inputCls(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password" name="password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password" placeholder="Your password"
                      value={form.password} onChange={handleChange}
                      className={`${inputCls(!!errors.password)} pr-12`}
                    />
                    <button
                      type="button" aria-label="Toggle password"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                    >
                      {showPw ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="login-submit" type="submit" disabled={loading}
                  className="mt-1 h-12 w-full rounded-xl font-semibold text-sm text-white
                    bg-gradient-to-r from-violet-600 to-indigo-600
                    hover:from-violet-500 hover:to-indigo-500
                    active:scale-[0.98] disabled:opacity-55 disabled:cursor-not-allowed
                    shadow-lg shadow-violet-500/25
                    flex items-center justify-center gap-2 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : 'Sign In →'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <hr className="flex-1 border-slate-200 dark:border-white/10" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">OR</span>
                <hr className="flex-1 border-slate-200 dark:border-white/10" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
                className="w-full h-12 rounded-xl flex items-center justify-center gap-3
                  bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10
                  hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200
                  group relative overflow-hidden"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Continue with Google</span>
              </button>

              {/* Feature pills divider */}
              <div className="flex items-center gap-3 my-5">
                <hr className="flex-1 border-slate-200 dark:border-white/10" />
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {FEATURES.map((f) => (
                  <span key={f} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full font-medium">
                    {f}
                  </span>
                ))}
              </div>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                New to Snitch?{' '}
                <Link to="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;