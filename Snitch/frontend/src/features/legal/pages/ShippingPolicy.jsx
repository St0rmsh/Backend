import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-[-0.04em] text-[#E5E2E1] mb-2 font-headline italic">Shipping Policy</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00f0ff]">
            <span>LAST UPDATED: APRIL 11, 2026</span>
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
            <span>SHP-042-S</span>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#131313] border border-white/5 relative group overflow-hidden">
                <span className="material-symbols-outlined text-[#00f0ff] text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">schedule</span>
                <h3 className="text-xl font-black text-[#E5E2E1] mb-2">Delivery Time</h3>
                <p className="text-[#b9cacb] text-sm leading-relaxed mb-4">
                    Standard Delivery: <strong className="text-[#00f0ff]">3–7 business days</strong>
                </p>
                <p className="text-[#b9cacb] text-sm leading-relaxed">
                    Express Delivery: <strong className="text-[#00f0ff]">1–3 business days</strong>
                </p>
            </div>
            <div className="p-8 rounded-3xl bg-[#131313] border border-white/5 relative group overflow-hidden">
                <span className="material-symbols-outlined text-[#7000ff] text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">inventory_2</span>
                <h3 className="text-xl font-black text-[#E5E2E1] mb-2">Order Processing</h3>
                <p className="text-[#b9cacb] text-sm leading-relaxed mb-4">
                    Orders are processed within <strong className="text-[#7000ff]">24–48 hours</strong>.
                </p>
                <p className="text-[#b9cacb] text-sm leading-relaxed">
                    Weekend orders are processed on the next business day.
                </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4">Shipping Coverage</h2>
          <p className="text-[#b9cacb] leading-relaxed">
            We currently deliver across all pin-codes in India. International shipping is currently unavailable but may be introduced in the future.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 text-[#ea4335]">Potential Delays</h2>
          <p className="text-[#b9cacb] leading-relaxed mb-6">
            While we strive for speed, delays may occur due to the following factors:
          </p>
          <div className="flex flex-wrap gap-3">
            {["Extreme Weather", "Logistics Congestion", "High Demand Drops", "National Holidays"].map(reason => (
                <div key={reason} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]"></span>
                    <span className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider">{reason}</span>
                </div>
            ))}
          </div>
        </section>

        <section className="pt-12 border-t border-white/5">
            <div className="p-8 rounded-3xl bg-[#131313] border border-[#00f0ff]/10">
                <h2 className="text-xl font-black text-[#E5E2E1] mb-4 italic">Damage Inspection</h2>
                <p className="text-[#b9cacb] text-sm leading-relaxed mb-6">
                    If you receive a package that is visibly damaged or tampered with, please do not accept the delivery and contact us immediately.
                </p>
                <a href="mailto:s2409796@gmal.com" className="text-[#00f0ff] font-bold text-lg hover:underline transition-all">
                    s2409796@gmal.com
                </a>
            </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
