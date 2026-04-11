import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const COUNTRIES = [
  { code: '+91', name: 'IN' },
  { code: '+1', name: 'US' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'AU' },
];

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
      <div 
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-[#1c1b1b] px-4 py-4 rounded-md border border-[#3b494b]/10 cursor-pointer hover:bg-[#201f1f] transition-colors h-[54px]"
      >
        <span className="text-sm font-semibold">{selected.code}</span>
        <svg fill="currentColor" className="text-[#b9cacb] w-4 h-4" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
      </div>
      {open && (
        <ul className="absolute top-full left-0 mt-2 w-32 max-h-48 overflow-y-auto rounded-md border shadow-2xl z-50 bg-[#1c1b1b] border-[#3b494b]/20 divide-y divide-[#3b494b]/10">
          {COUNTRIES.map((c) => {
            const active = c.code === value;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm text-left transition-colors ${active ? 'text-[#00f0ff]' : 'text-[#e5e2e1] hover:bg-[#201f1f]'}`}
                >
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-xs text-[#b9cacb]">{c.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const CompleteProfilePage = () => {
    const { user, handleCompleteProfile, loading } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ countryCode: '+91', number: '', role: 'buyer', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState({ number: '', password: '' });
    const [serverErr, setServerErr] = useState('');

    // Protect route: Ensure user is loaded
    if (!user) return <Navigate to="/login" replace />;
    // Redirect naturally if complete
    if (user && user.contact && (typeof user.contact === 'string' ? user.contact.trim() !== '' : user.contact.number)) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let hasError = false;
        const newError = { number: '', password: '' };

        if (!/^[6-9]\d{9}$/.test(form.number)) {
            newError.number = 'Enter valid 10-digit mobile number';
            hasError = true;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(form.password)) {
            newError.password = 'Password must be 6+ chars, 1 uppercase, 1 number';
            hasError = true;
        }

        setError(newError);
        if (hasError) return;
        
        if (!handleCompleteProfile) return;
        const result = await handleCompleteProfile({
            contact: { countryCode: form.countryCode, number: form.number },
            role: form.role,
            password: form.password
        });
        
        if (result.success) navigate('/', { replace: true });
        else setServerErr(result.error || 'Failed to complete profile.');
    };

    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-sans selection:bg-[#00f0ff] selection:text-[#006970]">
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#131313]/40 backdrop-blur-md shadow-[0px_10px_30px_rgba(0,240,255,0.05)]">
                <div className="text-2xl font-black italic text-[#E5E2E1] tracking-[-0.04em] font-sans">SNITCH</div>
            </header>
            
            <main className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center relative">
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div style={{ background: 'radial-gradient(circle at 10% 20%, rgba(112, 0, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 240, 255, 0.15) 0%, transparent 40%)' }} className="w-full h-full"></div>
                </div>

                <div className="relative z-10 w-full max-w-md bg-[rgba(53,53,52,0.4)] backdrop-blur-[20px] rounded-2xl p-8 flex flex-col gap-10 border border-[#3b494b]/15 shadow-2xl">
                    <div className="space-y-2">
                        <h1 className="font-sans font-black text-5xl tracking-[-0.04em] text-[#dbfcff]">Almost there!</h1>
                        <p className="text-[#b9cacb] font-medium text-sm tracking-wide uppercase">Complete your identity to access the drop.</p>
                    </div>

                    {serverErr && (
                        <div className="bg-[#93000a]/20 border border-[#93000a] text-[#ffb4ab] px-4 py-3 rounded text-sm">
                            {serverErr}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
                        <div className="space-y-4">
                            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#b9cacb] block">MOBILE NUMBER</label>
                            <div className="flex gap-2">
                                <CountryPicker
                                    value={form.countryCode}
                                    onChange={(code) => setForm((p) => ({ ...p, countryCode: code }))}
                                />
                                <input 
                                    className={`flex-1 bg-[#1c1b1b] border ${error.number ? 'border-[#ffb4ab]' : 'border-[#3b494b]/10'} rounded-md px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none placeholder:text-[#b9cacb]/30 transition-all h-[54px]`}
                                    placeholder="000-000-0000" 
                                    type="tel"
                                    value={form.number}
                                    onChange={(e) => {
                                        setForm({...form, number: e.target.value});
                                        setError(p => ({...p, number: ''}));
                                    }}
                                />
                            </div>
                            {error.number && <p className="text-[#ffb4ab] text-xs mt-1">{error.number}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#b9cacb] block">PASSWORD</label>
                            <div className="relative">
                                <input 
                                    className={`w-full bg-[#1c1b1b] border ${error.password ? 'border-[#ffb4ab]' : 'border-[#3b494b]/10'} rounded-md px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none placeholder:text-[#b9cacb]/30 transition-all h-[54px]`}
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => {
                                        setForm({...form, password: e.target.value});
                                        setError(p => ({...p, password: ''}));
                                    }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b9cacb] hover:text-[#00f0ff] transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A11.055 11.055 0 001.5 12c.563 3.013 3.4 5.5 8.5 5.5s7.937-2.487 8.5-5.5a11.055 11.055 0 00-2.48-3.777M15.312 7.02c.384.223.746.47 1.085.738a11.099 11.099 0 013.103 4.242M9.47 9.47l-4.242-4.242M19.42 19.42l-4.242-4.242M14.53 14.53L9.47 9.47m5.06 5.06L19.42 19.42m-5.06-5.06l-4.242-4.242m0 0L3.34 3.34" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.045 5.5 11.5 5.5s8.101 2.549 9.464 6.178c.07.233.07.47 0 .704-1.363 4.273-5.008 6.822-9.464 6.822s-8.101-2.549-9.464-6.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {error.password && <p className="text-[#ffb4ab] text-xs mt-1">{error.password}</p>}
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#b9cacb] block">I WANT TO:</label>
                            <div className="grid grid-cols-1 gap-4">
                                <div 
                                    onClick={() => setForm({...form, role: 'buyer'})}
                                    className={`group relative hover:bg-[#2a2a2a] transition-all p-6 rounded-md border cursor-pointer overflow-hidden active:scale-95 duration-200 ${form.role === 'buyer' ? 'bg-[#2a2a2a] border-[#00f0ff]' : 'bg-[#1c1b1b] border-[#3b494b]/10'}`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <h3 className={`font-sans font-bold text-xl transition-colors ${form.role === 'buyer' ? 'text-[#00f0ff]' : 'text-[#e5e2e1]'}`}>Buyer</h3>
                                            <p className="text-xs text-[#b9cacb] font-medium mt-1">Shop & discover</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#7000ff]/5 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div 
                                    onClick={() => setForm({...form, role: 'seller'})}
                                    className={`group relative hover:bg-[#2a2a2a] transition-all p-6 rounded-md border cursor-pointer overflow-hidden active:scale-95 duration-200 ${form.role === 'seller' ? 'bg-[#2a2a2a] border-[#d1bcff]' : 'bg-[#1c1b1b] border-[#3b494b]/10'}`}
                                >
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <h3 className={`font-sans font-bold text-xl transition-colors ${form.role === 'seller' ? 'text-[#d1bcff]' : 'text-[#e5e2e1]'}`}>Seller</h3>
                                            <p className="text-xs text-[#b9cacb] font-medium mt-1">List & earn</p>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#7000ff]/5 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-[#b9cacb] leading-relaxed px-4">
                            BY CONTINUING, YOU AGREE TO OUR <Link to="/legal/terms" className="text-[#dbfcff] hover:underline cursor-pointer">TERMS OF SERVICE</Link> AND <Link to="/legal/privacy" className="text-[#dbfcff] hover:underline cursor-pointer">PRIVACY POLICY</Link>.
                        </p>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#7000ff] to-[#00f0ff] text-[#002022] py-5 rounded-md font-sans font-black text-sm uppercase tracking-[0.1em] shadow-[0_0_25px_rgba(0,240,255,0.2)] hover:shadow-[0_0_35px_rgba(0,240,255,0.4)] disabled:opacity-50 transition-all active:scale-[0.98] duration-150"
                        >
                            {loading ? 'PROCESSING...' : 'Complete Profile'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CompleteProfilePage;
