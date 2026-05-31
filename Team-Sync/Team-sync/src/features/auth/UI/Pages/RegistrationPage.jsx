import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router";

const NeuralBackground = () => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
            <radialGradient id="bg" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#0d1f3c" />
                <stop offset="100%" stopColor="#060d1a" />
            </radialGradient>
            <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1a4a8a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1a4a8a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4a1a8a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4a1a8a" stopOpacity="0" />
            </radialGradient>
            <filter id="blur">
                <feGaussianBlur stdDeviation="8" />
            </filter>
        </defs>
        <rect width="600" height="900" fill="url(#bg)" />
        <ellipse cx="300" cy="350" rx="350" ry="280" fill="url(#glow1)" filter="url(#blur)" />
        <ellipse cx="180" cy="600" rx="200" ry="180" fill="url(#glow2)" filter="url(#blur)" />
        {/* Neural network lines */}
        {[
            [120, 180, 280, 320], [280, 320, 180, 480], [280, 320, 380, 440], [380, 440, 250, 580],
            [380, 440, 480, 520], [180, 480, 300, 600], [300, 600, 420, 680], [150, 300, 280, 320],
            [430, 200, 280, 320], [480, 380, 380, 440], [100, 520, 180, 480], [500, 600, 420, 680],
            [200, 720, 300, 600], [420, 680, 520, 750], [300, 600, 180, 700]
        ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a6ab5" strokeWidth="0.8" strokeOpacity="0.5" />
        ))}
        {/* Neural nodes */}
        {[
            [120, 180], [280, 320], [180, 480], [380, 440], [300, 600], [420, 680], [150, 300],
            [430, 200], [480, 380], [100, 520], [500, 600], [200, 720], [520, 750], [180, 700]
        ].map(([cx, cy], i) => (
            <g key={i}>
                <circle cx={cx} cy={cy} r="5" fill="#1a4a8a" stroke="#4a9af5" strokeWidth="1" strokeOpacity="0.8" />
                <circle cx={cx} cy={cy} r="10" fill="none" stroke="#4a9af5" strokeWidth="0.5" strokeOpacity="0.3" />
                {/* Floating dots */}
                <circle cx={cx + Math.sin(i) * 20} cy={cy + Math.cos(i) * 15} r="2" fill="#c084fc" fillOpacity="0.6" />
            </g>
        ))}
        {/* Bright accent dots */}
        {[[230, 260, 8], [340, 510, 6], [160, 650, 5], [450, 320, 7]].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="#a78bfa" fillOpacity="0.5" filter="url(#blur)" />
        ))}
    </svg>
);

const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
);

const UserIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22,7-10,7L2,7" />
    </svg>
);

const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeIcon = ({ open }) => open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const SSOIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
);

const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: "", color: "" },
        { label: "Weak", color: "#ef4444" },
        { label: "Fair", color: "#f59e0b" },
        { label: "Good", color: "#3b82f6" },
        { label: "Strong", color: "#8b5cf6" },
    ];
    return { score, ...levels[score] };
};

export default function RegistrationPage() {


    const {  register,
  handleSubmit,
  errors,
  isSubmitting,
  mounted,
  showPassword,
  setShowPassword,
  password,
  onRegisterSubmit,
  submitted, } = useAuth();

       const strength = getPasswordStrength(password)


    if (submitted) {
        return (
            <div className="min-h-screen bg-[#080f1e] flex items-center justify-center font-sans">
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-6">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Account Created!</h2>
                    <p className="text-slate-400 text-sm">Welcome to Synthetix AI. Check your inbox to verify your email.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; }
        body { background: #080f1e; }
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.2s; }
        .fade-up.d3 { transition-delay: 0.3s; }
        .fade-up.d4 { transition-delay: 0.4s; }
        .fade-up.d5 { transition-delay: 0.5s; }
        .fade-up.d6 { transition-delay: 0.6s; }
        .fade-up.d7 { transition-delay: 0.7s; }
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: white; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; }
        .input-field:focus { outline: none; border-color: rgba(139,92,246,0.6); background: rgba(139,92,246,0.05); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field.error-field { border-color: rgba(239,68,68,0.5); }
        .btn-primary { background: linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa); transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 4px 20px rgba(139,92,246,0.35); }
        .btn-primary:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(139,92,246,0.5); }
        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-outline { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: white; transition: background 0.2s, border-color 0.2s; }
        .btn-outline:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
        .str-bar { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .str-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease, background 0.4s ease; }
        .custom-checkbox { appearance: none; width: 16px; height: 16px; border: 1.5px solid rgba(255,255,255,0.25); border-radius: 4px; background: transparent; cursor: pointer; transition: border-color 0.2s, background 0.2s; flex-shrink: 0; }
        .custom-checkbox:checked { background: #8b5cf6; border-color: #8b5cf6; background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4L3.5 6.5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; }
        .stat-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.1); }
        @keyframes pulse-dot { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
        .pulse-1 { animation: pulse-dot 2s ease-in-out infinite; }
        .pulse-2 { animation: pulse-dot 2s ease-in-out infinite 0.4s; }
        .pulse-3 { animation: pulse-dot 2s ease-in-out infinite 0.8s; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
      `}</style>

            <div className="min-h-screen flex flex-col" style={{ background: "#080f1e", fontFamily: "'DM Sans', sans-serif" }}>
                {/* Header */}
                <header className="flex items-center justify-between px-8 py-5 z-10 relative">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: "'Syne', sans-serif" }}>Synthetix AI</span>
                    </div>
                </header>

                {/* Main content */}
                <div className="flex flex-1">
                    {/* Left panel */}
                    <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden p-12">
                        <NeuralBackground />
                        <div className="relative z-10 flex-1 flex flex-col justify-end pb-8">
                            <div className={`fade-up d2 ${mounted ? "visible" : ""}`}>
                                <div className="flex items-center gap-2 mb-5">
                                    <StarIcon />
                                    <span className="text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase">Next-Gen Intelligence</span>
                                </div>
                                <h1 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    Accelerate your team's intelligence.
                                </h1>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                    Connect your enterprise data to our specialized AI models and unlock unparalleled strategic insights in seconds.
                                </p>
                            </div>
                            <div className={`fade-up d3 ${mounted ? "visible" : ""} flex items-center gap-8 mt-10`}>
                                <div>
                                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>99.9%</div>
                                    <div className="text-xs text-slate-500 mt-0.5">Uptime SLA</div>
                                </div>
                                <div className="stat-divider" />
                                <div>
                                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>ISO</div>
                                    <div className="text-xs text-slate-500 mt-0.5">27001 Certified</div>
                                </div>
                                <div className="stat-divider" />
                                <div>
                                    <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>2M+</div>
                                    <div className="text-xs text-slate-500 mt-0.5">API Calls/day</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16">
                        <div className="w-full max-w-[460px]">
                            <div className={`fade-up d1 ${mounted ? "visible" : ""} mb-8`}>
                                <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    Create your account
                                </h2>
                                <p className="text-slate-400 text-sm">Experience the future of collaborative data intelligence.</p>
                            </div>

                            <form onSubmit={handleSubmit(onRegisterSubmit)} noValidate>
                                {/* Full Name */}
                                <div className={`fade-up d2 ${mounted ? "visible" : ""} mb-5`}>
                                    <label className="block text-xs font-medium text-slate-300 mb-2 tracking-wide">Full Name</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            <UserIcon />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            className={`input-field w-full rounded-xl px-4 pl-11 py-3.5 text-sm ${errors.fullName ? "error-field" : ""}`}
                                            {...register("fullName", {
                                                required: "Full name is required",
                                                minLength: { value: 2, message: "Name must be at least 2 characters" },
                                            })}
                                        />
                                    </div>
                                    {errors.fullName && (
                                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                            <span>⚠</span> {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className={`fade-up d3 ${mounted ? "visible" : ""} mb-5`}>
                                    <label className="block text-xs font-medium text-slate-300 mb-2 tracking-wide">Email Address</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            <MailIcon />
                                        </span>
                                        <input
                                            type="email"
                                            placeholder="name@company.com"
                                            className={`input-field w-full rounded-xl px-4 pl-11 py-3.5 text-sm ${errors.email ? "error-field" : ""}`}
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                            <span>⚠</span> {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className={`fade-up d4 ${mounted ? "visible" : ""} mb-5`}>
                                    <label className="block text-xs font-medium text-slate-300 mb-2 tracking-wide">Password</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                            <LockIcon />
                                        </span>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`input-field w-full rounded-xl px-4 pl-11 pr-12 py-3.5 text-sm ${errors.password ? "error-field" : ""}`}
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: { value: 8, message: "Must be at least 8 characters" },
                                                validate: {
                                                    hasUpper: v => /[A-Z]/.test(v) || "Must include an uppercase letter",
                                                    hasNumber: v => /[0-9]/.test(v) || "Must include a number",
                                                },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                            onClick={() => setShowPassword(s => !s)}
                                        >
                                            <EyeIcon open={showPassword} />
                                        </button>
                                    </div>
                                    {/* Strength bars */}
                                    {showPassword && (
                                        <div className="mt-2.5 space-y-1.5">
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="str-bar flex-1">
                                                        <div
                                                            className="str-fill"
                                                            style={{
                                                                width: strength.score >= i ? "100%" : "0%",
                                                                background: strength.color,
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs" style={{ color: strength.color }}>{strength.label} password</p>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                            <span>⚠</span> {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Terms */}
                                <div className={`fade-up d5 ${mounted ? "visible" : ""} mb-6`}>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox mt-0.5"
                                            {...register("terms", { required: "You must agree to the terms" })}
                                        />
                                        <span className="text-xs text-slate-400 leading-relaxed">
                                            I agree to the{" "}
                                            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Terms of Service</a>
                                            {" "}and{" "}
                                            <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</a>.
                                        </span>
                                    </label>
                                    {errors.terms && (
                                        <p className="text-red-400 text-xs mt-1.5 ml-7 flex items-center gap-1">
                                            <span>⚠</span> {errors.terms.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className={`fade-up d6 ${mounted ? "visible" : ""}`}>
                                   <button
  type="submit"
  disabled={isSubmitting}
  className="btn-primary w-full rounded-xl py-3.5 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
>
  {isSubmitting ? (
    <>
      <svg
        className="spinner w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
      Creating Account...
    </>
  ) : (
    "Create Account"
  )}
</button>
                                </div>
                            </form>

                            {/* Divider */}
                            <div className={`fade-up d6 ${mounted ? "visible" : ""} flex items-center gap-4 my-6`}>
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-xs text-slate-600 uppercase tracking-widest">or continue with</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Social buttons */}
                            <div className={`fade-up d7 ${mounted ? "visible" : ""} flex gap-3`}>
                                <button className="btn-outline flex-1 rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium">
                                    <GoogleIcon />
                                    Google
                                </button>
                                <button className="btn-outline flex-1 rounded-xl py-3 flex items-center justify-center gap-2.5 text-sm font-medium">
                                    <SSOIcon />
                                    SSO
                                </button>
                            </div>

                            {/* Login link */}
                            <div className={`fade-up d7 ${mounted ? "visible" : ""} text-center mt-7 text-sm text-slate-500`}>
                                Already have an account?{" "}
                                <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Log In</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="flex flex-wrap items-center justify-between px-8 py-5 border-t border-white/5 text-xs text-slate-600 gap-4 z-10 relative">
                    <span style={{ fontFamily: "'Syne', sans-serif" }} className="font-semibold text-slate-500">Synthetix AI</span>
                    <div className="flex flex-wrap gap-5">
                        {["Privacy Policy", "Terms of Service", "Security", "System Status"].map(item => (
                            <a key={item} href="#" className="hover:text-slate-400 transition-colors">{item}</a>
                        ))}
                    </div>
                    <span>© 2024 Synthetix AI. Enterprise Intelligence Platforms.</span>
                </footer>
            </div>
        </>
    );
}