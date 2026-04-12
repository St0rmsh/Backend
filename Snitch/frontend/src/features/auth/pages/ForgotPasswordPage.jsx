import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';

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

const inputCls = (hasError) =>
    `w-full h-12 bg-white dark:bg-white/5 border rounded-xl px-4 text-sm
   text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
   focus:outline-none focus:ring-2 transition-all duration-200
   ${hasError
        ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
        : 'border-slate-200 dark:border-white/10 focus:border-violet-500 focus:ring-violet-500/20'
    }`;

const ForgotPasswordPage = () => {
    const { handleForgotPassword, loading } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Enter a valid email address');
            return;
        }

        const result = await handleForgotPassword(email);
        if (result.success) {
            setMessage(result.message || 'We have sent a new temporary password to your email. Please check your inbox and use it to log in.');
        } else {
            setError(result.error || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080b14] transition-colors duration-300 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-60 -right-40 w-[500px] h-[500px] bg-violet-400/8 dark:bg-violet-600/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] bg-indigo-400/8 dark:bg-indigo-600/15 rounded-full blur-3xl" />
            </div>

            {/* Theme toggle */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-300 transition-all duration-200"
                >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl p-8">
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 mb-4">
                            <span className="text-white text-3xl font-black">?</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl mb-6">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={inputCls(!!error)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link to="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
