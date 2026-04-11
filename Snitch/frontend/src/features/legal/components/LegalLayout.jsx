import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const navItems = [
  { name: 'Terms of Service', path: '/legal/terms', icon: 'description' },
  { name: 'Privacy Policy', path: '/legal/privacy', icon: 'security' },
  { name: 'Return & Refund', path: '/legal/returns', icon: 'assignment_return' },
  { name: 'Shipping Policy', path: '/legal/shipping', icon: 'local_shipping' },
];

const LegalLayout = () => {
    const { pathname } = useLocation();

    return (
        <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans selection:bg-[#00f0ff] selection:text-[#002022]">
            {/* Glossy Header */}
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 h-20 bg-[#131313]/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                <Link to="/" className="text-3xl font-black italic text-[#E5E2E1] tracking-[-0.04em] flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7000ff] to-[#00f0ff] p-[1.5px] group-active:scale-95 transition-transform">
                        <div className="w-full h-full bg-[#131313] rounded-[3px] flex items-center justify-center">
                            <span className="text-xs font-black not-italic text-[#00f0ff]">S</span>
                        </div>
                    </div>
                    SNITCH
                </Link>
                <div className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-widest text-[#b9cacb]">
                    <span className="hover:text-[#00f0ff] cursor-pointer transition-colors">SUPPORT CENTER</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="hover:text-[#00f0ff] cursor-pointer transition-colors">POLICIES</span>
                </div>
            </header>

            <div className="max-w-7xl mx-auto pt-32 pb-20 px-6 md:px-12 flex flex-col md:flex-row gap-12 relative z-10">
                {/* Sidebar Navigation */}
                <aside className="md:w-72 shrink-0">
                    <div className="md:sticky md:top-32 space-y-8">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b9cacb] mb-6 opacity-60">Legal Center</h2>
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`group flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                                                isActive 
                                                ? 'bg-gradient-to-r from-[#00f0ff]/10 to-transparent text-[#00f0ff] border border-[#00f0ff]/20' 
                                                : 'hover:bg-white/5 text-[#b9cacb] border border-transparent'
                                            }`}
                                        >
                                            <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00f0ff] rounded-r-full shadow-[0_0_15px_#00f0ff]"></div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Support Card */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#201f1f] to-[#131313] border border-white/5 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#7000ff]/10 blur-3xl group-hover:bg-[#7000ff]/20 transition-colors"></div>
                            <h3 className="text-sm font-black mb-2 tracking-tight">Need help?</h3>
                            <p className="text-xs text-[#b9cacb] leading-relaxed mb-4">Our support team is available 24/7 for any clarifications regarding our policies.</p>
                            <a href="mailto:s2409796@gmal.com" className="text-xs font-black text-[#00f0ff] hover:underline flex items-center gap-2">
                                Contact Support
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 min-w-0">
                    <div className="bg-[#1c1b1b]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl relative">
                        {/* Decorative Gradient Background for Card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/5 blur-[100px] pointer-events-none -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7000ff]/5 blur-[100px] pointer-events-none -z-10"></div>
                        
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Aesthetic Floating Elements */}
            <div className="fixed top-[20%] left-[5%] w-64 h-64 bg-[#7000ff]/5 blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-[10%] right-[5%] w-80 h-80 bg-[#00f0ff]/5 blur-[150px] pointer-events-none -z-10"></div>
        </div>
    );
};

export default LegalLayout;
