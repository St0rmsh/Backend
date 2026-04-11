import { useState, useRef, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';

/* ── Country list ────────────────────────────────────────── */
const COUNTRIES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'United States' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
];

/* ── Role options ────────────────────────────────────────── */
const ROLES = [
  { value: 'buyer', emoji: '🛍️', title: 'Buyer', desc: 'Shop & discover' },
  { value: 'seller', emoji: '🏪', title: 'Seller', desc: 'List & earn' },
];

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
const ChevronDown = ({ open }) => (
  <svg className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

/* ── Custom Country Picker ───────────────────────────────── */
const CountryPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = COUNTRIES.find((c) => c.code === value) || COUNTRIES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 h-12 px-3 pr-2 rounded-xl border
          bg-white border-slate-200 text-slate-800
          dark:bg-white/5 dark:border-white/10 dark:text-white
          hover:border-violet-400 dark:hover:border-violet-500
          focus:outline-none focus:border-violet-500
          transition-all duration-200 cursor-pointer select-none whitespace-nowrap"
      >
        <span className="text-xl leading-none">{selected.flag}</span>
        <span className="text-sm font-semibold">{selected.code}</span>
        <ChevronDown open={open} />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          className="absolute top-full left-0 mt-2 w-56 max-h-60 overflow-y-auto
            rounded-xl border shadow-2xl z-50
            bg-white border-slate-200
            dark:bg-[#0f1525] dark:border-white/10
            divide-y divide-slate-100 dark:divide-white/5"
        >
          {COUNTRIES.map((c) => {
            const active = c.code === value;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left transition-colors duration-150
                    ${active
                      ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className={`text-xs font-mono ${active ? 'text-violet-500 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {c.code}
                  </span>
                  {active && (
                    <svg className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.17l6.879-6.877a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/* ── Field wrapper ───────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
    {children}
    {error && (
      <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

/* ── Input class helper ──────────────────────────────────── */
const inputCls = (hasError) =>
  `w-full h-12 bg-white dark:bg-white/5 border rounded-xl px-4 text-sm
   text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
   focus:outline-none focus:ring-2 transition-all duration-200
   ${hasError
    ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
    : 'border-slate-200 dark:border-white/10 focus:border-violet-500 focus:ring-violet-500/20'
  }`;

/* ── Password strength ───────────────────────────────────── */
const strengthMeta = [
  { label: '', color: '' },
  { label: 'Weak', color: 'bg-red-500' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-blue-500' },
  { label: 'Strong', color: 'bg-emerald-500' },
];
const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

/* ════════════════════════════════════════════════════════════
   REGISTER PAGE
════════════════════════════════════════════════════════════ */
const RegisterPage = () => {
  const { handleRegister, user, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: '', email: '', password: '',
    countryCode: '+91', number: '', role: 'buyer',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState('');

  if (user) return <Navigate to="/" replace />;

  /* Client-side validation mirrors backend rules */
  const validate = () => {
    const e = {};
    if (!form.fullname.trim()) e.fullname = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    else if (!/[A-Z]/.test(form.password)) e.password = 'Needs an uppercase letter';
    else if (!/[0-9]/.test(form.password)) e.password = 'Needs a number';
    if (!/^[6-9]\d{9}$/.test(form.number)) e.number = 'Enter valid 10-digit number';
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

    const result = await handleRegister({
      fullname: form.fullname,
      email: form.email,
      password: form.password,
      contact: { countryCode: form.countryCode, number: form.number },
      role: form.role,
    });
    if (result.success) navigate('/', { replace: true });
    else setServerErr(result.error || 'Registration failed. Please try again.');
  };

  const strength = getStrength(form.password);
  const sm = strengthMeta[strength];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b14] transition-colors duration-300">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 -left-40 w-[500px] h-[500px] bg-violet-400/8 dark:bg-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-60 -right-40 w-[500px] h-[500px] bg-indigo-400/8 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-300/5 dark:bg-violet-900/10 rounded-full blur-3xl" />
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

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-10 sm:py-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-black text-xl leading-none">S</span>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Snitch</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg bg-white dark:bg-white/5 backdrop-blur-xl
          border border-slate-200 dark:border-white/10
          rounded-2xl shadow-xl dark:shadow-black/30 p-6 sm:p-8">

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join Snitch and start shopping the latest trends</p>
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
            {/* Row: Full name */}
            <Field label="Full Name" error={errors.fullname}>
              <input
                id="fullname" name="fullname" type="text"
                autoComplete="name" placeholder="John Doe"
                value={form.fullname} onChange={handleChange}
                className={inputCls(!!errors.fullname)}
              />
            </Field>

            {/* Row: Email */}
            <Field label="Email Address" error={errors.email}>
              <input
                id="email" name="email" type="email"
                autoComplete="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className={inputCls(!!errors.email)}
              />
            </Field>

            {/* Row: Password */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 6 chars, 1 uppercase, 1 number"
                  value={form.password} onChange={handleChange}
                  className={`${inputCls(!!errors.password)} pr-12`}
                />
                <button
                  type="button" aria-label="Toggle password visibility"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  {showPw ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? sm.color : 'bg-slate-200 dark:bg-white/10'}`} />
                    ))}
                  </div>
                  {sm.label && (
                    <p className={`text-xs font-semibold ${strength === 1 ? 'text-red-500' :
                      strength === 2 ? 'text-amber-500' :
                        strength === 3 ? 'text-blue-500' : 'text-emerald-500'
                      }`}>{sm.label}</p>
                  )}
                </div>
              )}
            </Field>

            {/* Row: Phone */}
            <Field label="Phone Number" error={errors.number}>
              <div className="flex gap-2 items-start">
                <CountryPicker
                  value={form.countryCode}
                  onChange={(code) => setForm((p) => ({ ...p, countryCode: code }))}
                />
                <input
                  id="number" name="number" type="tel"
                  placeholder="9876543210"
                  value={form.number} onChange={handleChange}
                  className={`${inputCls(!!errors.number)} flex-1`}
                />
              </div>
            </Field>

            {/* Row: Role */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">I want to</span>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => {
                  const active = form.role === r.value;
                  return (
                    <button
                      key={r.value} type="button"
                      onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                      className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 overflow-hidden
                        ${active
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/15 shadow-md shadow-violet-500/15'
                          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-violet-300 dark:hover:border-violet-500/50'
                        }`}
                    >
                      {/* Active glow */}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
                      )}
                      {/* Check badge */}
                      {active && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.17l6.879-6.877a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      <span className="text-2xl">{r.emoji}</span>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${active ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-300'}`}>{r.title}</p>
                        <p className={`text-xs mt-0.5 ${active ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`}>{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit" type="submit" disabled={loading}
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
                  Creating account…
                </>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>

          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-slate-200 dark:border-white/10" />
            <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">OR</span>
            <hr className="flex-1 border-slate-200 dark:border-white/10" />
          </div>

          <button
            type="button"
            onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3
              bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10
              hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Continue with Google</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 mt-8">
          © 2026 Snitch. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;