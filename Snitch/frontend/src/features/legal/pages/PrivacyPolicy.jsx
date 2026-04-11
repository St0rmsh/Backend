import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-[-0.04em] text-[#E5E2E1] mb-2 font-headline italic">Privacy Policy</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00f0ff]">
            <span>LAST UPDATED: APRIL 11, 2026</span>
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
            <span>PRIV-101-B</span>
        </div>
      </div>

      <p className="text-[#b9cacb] leading-relaxed mb-12 text-lg">
        At <strong className="text-[#00f0ff]">Snitch</strong>, we respect your privacy and are committed to protecting your personal data. This policy outlines how we handle your information.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">01</span>
            Information We Collect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
                { title: "Personal Details", desc: "Name, email, and mobile number." },
                { title: "Shipping Data", desc: "Address for delivery and billing." },
                { title: "Payment Info", desc: "Processed securely via third-parties." },
                { title: "Usage Data", desc: "Device and browsing interactions." }
            ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#131313] border border-white/5">
                    <h3 className="text-[#00f0ff] font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-[#b9cacb] text-xs leading-relaxed">{item.desc}</p>
                </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">02</span>
            How We Use Your Data
          </h2>
          <ul className="space-y-3 list-none pl-0">
            {[
              "To process and deliver your orders.",
              "To provide customer support and service updates.",
              "To improve our platform and user experience.",
              "To send personalized offers and notifications."
            ].map((item, i) => (
              <li key={i} className="flex gap-4 text-[#b9cacb]">
                <span className="text-[#00f0ff] mt-1.5 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">03</span>
            Sharing of Information
          </h2>
          <p className="text-[#b9cacb] leading-relaxed mb-4">
            We do not sell your personal data. We share it only with:
          </p>
          <div className="flex flex-wrap gap-2">
            {["Payment Gateways", "Delivery Partners", "Legal Authorities (if required)", "Security Analytics"].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-[#b9cacb]">{tag}</span>
            ))}
          </div>
        </section>

        <section>
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#131313] to-[#1c1b1b] border border-[#7000ff]/20">
                <h2 className="text-xl font-black text-[#E5E2E1] mb-4">Data Security</h2>
                <p className="text-[#b9cacb] text-sm leading-relaxed">
                    We implement strong industry-standard security measures to protect your data. However, please note that no system is 100% secure.
                </p>
            </div>
        </section>

        <section className="pt-12 border-t border-white/5">
            <div className="p-8 rounded-3xl bg-[#131313] border border-[#00f0ff]/10">
                <h2 className="text-xl font-black text-[#E5E2E1] mb-4">Contact</h2>
                <p className="text-[#b9cacb] text-sm leading-relaxed mb-6">
                    For any privacy related concerns or data requests:
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

export default PrivacyPolicy;
