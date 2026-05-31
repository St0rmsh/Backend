import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const SignInArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
);

export default function LoginPage() {

    const { register,
  onLoginSubmit,
  handleSubmit,
  errors,
  mounted,
  showPassword,
  setShowPassword,
  isSubmitting,
  submitted,} = useAuth()

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#12111a" }}>
        <div className="text-center space-y-3 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p className="text-white font-semibold text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Signed in successfully!</p>
          <p className="text-slate-500 text-sm">Redirecting to your workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .bg-page {
          background: radial-gradient(ellipse at 20% 30%, #1a1630 0%, #0e0d16 50%, #0a0910 100%);
          min-height: 100vh;
        }

        /* Subtle corner glow */
        .bg-page::before {
          content: '';
          position: fixed;
          bottom: -80px; right: -80px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(88,60,180,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .bg-page::after {
          content: '';
          position: fixed;
          top: -60px; left: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60,40,140,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(24px);
        }

        .fade-up { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .fade-up.show { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.08s; }
        .d2 { transition-delay: 0.16s; }
        .d3 { transition-delay: 0.24s; }
        .d4 { transition-delay: 0.32s; }
        .d5 { transition-delay: 0.40s; }
        .d6 { transition-delay: 0.48s; }
        .d7 { transition-delay: 0.56s; }
        .d8 { transition-delay: 0.64s; }

        .social-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.75);
          border-radius: 10px;
          padding: 10px 0;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          cursor: pointer;
          width: 100%;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          color: white;
        }

        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }

        .field-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 12px 14px;
          color: white;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: rgba(139,92,246,0.55);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .input-field.has-error { border-color: rgba(239,68,68,0.45); }

        .error-msg { color: #f87171; font-size: 11px; margin-top: 6px; display: flex; align-items: center; gap: 4px; }

        .custom-cb {
          appearance: none; width: 16px; height: 16px; flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.2); border-radius: 4px;
          background: transparent; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .custom-cb:checked {
          background: #7c3aed; border-color: #7c3aed;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='8' viewBox='0 0 10 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 4l2.5 2.5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: center;
        }

        .btn-sign-in {
          width: 100%;
          background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%);
          border: none;
          border-radius: 10px;
          padding: 13px;
          color: white;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(109,40,217,0.4);
          font-family: 'DM Sans', sans-serif;
        }
        .btn-sign-in:hover:not(:disabled) {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(109,40,217,0.55);
        }
        .btn-sign-in:active:not(:disabled) { transform: translateY(0); }
        .btn-sign-in:disabled { opacity: 0.65; cursor: not-allowed; }

        .card-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.07); }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.75s linear infinite; }

        .logo-box {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #6d28d9, #8b5cf6);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(109,40,217,0.45);
        }
      `}</style>

      <div className="bg-page flex flex-col items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Card */}
        <div className="card w-full max-w-[380px] p-8">

          {/* Logo + title */}
          <div className={`fade-up d1 ${mounted ? "show" : ""} flex flex-col items-center mb-7`}>
            <div className="logo-box mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Synthetix AI</h1>
            <p className="text-slate-500 text-sm">Sign in to your workspace</p>
          </div>

          {/* Social buttons */}
          <div className={`fade-up d2 ${mounted ? "show" : ""} flex gap-3 mb-5`}>
            <button type="button" className="social-btn">
              <GoogleIcon /> GOOGLE
            </button>
            <button type="button" className="social-btn">
              <GithubIcon /> GITHUB
            </button>
          </div>

          {/* Divider */}
          <div className={`fade-up d3 ${mounted ? "show" : ""} flex items-center gap-3 mb-5`}>
            <div className="divider-line" />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>or continue with email</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onLoginSubmit)} noValidate>

            {/* Email */}
            <div className={`fade-up d4 ${mounted ? "show" : ""} mb-4`}>
              <label className="field-label">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className={`input-field ${errors.email ? "has-error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
              />
              {errors.email && <p className="error-msg"><span>⚠</span>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={`fade-up d5 ${mounted ? "show" : ""} mb-4`}>
              <div className="flex items-center justify-between mb-2">
                <label className="field-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}
                  className="hover:text-violet-400 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className={`input-field pr-10 ${errors.password ? "has-error" : ""}`}
                  style={{ paddingRight: 42 }}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                  className="hover:text-slate-300 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && <p className="error-msg"><span>⚠</span>{errors.password.message}</p>}
            </div>

            {/* Stay signed in */}
            <div className={`fade-up d6 ${mounted ? "show" : ""} flex items-center gap-2.5 mb-5`}>
              <input type="checkbox" className="custom-cb" id="stay" {...register("staySignedIn")} />
              <label htmlFor="stay" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                Stay signed in
              </label>
            </div>

            {/* Submit */}
            <div className={`fade-up d7 ${mounted ? "show" : ""}`}>
             <button
  type="submit"
  className="btn-sign-in"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <svg
        className="spinner"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeOpacity="0.25"
        />
        <path d="M22 12a10 10 0 0 1-10 10" />
      </svg>
      Signing In...
    </>
  ) : (
    <>
      Sign In <SignInArrow />
    </>
  )}
</button> 
            </div>
          </form>

          {/* Divider + sign up */}
          <div className={`fade-up d8 ${mounted ? "show" : ""}`}>
            <div className="card-divider my-6" />
            <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#a78bfa", fontWeight: 600 }} className="hover:text-violet-300 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`fade-up d8 ${mounted ? "show" : ""} mt-8 text-center`} style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
          <p className="mb-2">© 2024 Synthetix AI. Enterprise Intelligence Platforms.</p>
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </>
  );
}