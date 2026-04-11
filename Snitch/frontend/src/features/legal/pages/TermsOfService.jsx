import React from 'react';

const TermsOfService = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-[-0.04em] text-[#E5E2E1] mb-2 font-headline italic">Terms of Service</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00f0ff]">
            <span>LAST UPDATED: APRIL 11, 2026</span>
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
            <span>POL-229-A</span>
        </div>
      </div>

      <p className="text-[#b9cacb] leading-relaxed mb-12 text-lg">
        Welcome to <strong className="text-[#00f0ff]">Snitch</strong>. These Terms of Service ("Terms") govern your use of our website, services, and products. By accessing or using Snitch, you agree to be bound by these Terms.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">01</span>
            Eligibility
          </h2>
          <p className="text-[#b9cacb] leading-relaxed">
            You must be at least 18 years old or have parental/guardian consent to use this platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">02</span>
            Account Responsibility
          </h2>
          <ul className="space-y-3 list-none pl-0">
            {[
              "You are responsible for maintaining the confidentiality of your account.",
              "Any activity under your account is your responsibility.",
              "You must provide accurate and up-to-date information."
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
            Orders & Payments
          </h2>
          <ul className="space-y-3 list-none pl-0">
            {[
              "All orders are subject to availability and confirmation.",
              "Prices may change without prior notice.",
              "We reserve the right to cancel or refuse any order."
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
            <span className="text-[#00f0ff] font-serif italic text-3xl">04</span>
            Shipping & Delivery
          </h2>
          <ul className="space-y-3 list-none pl-0">
            {[
              "Delivery timelines are estimates and may vary.",
              "Snitch is not responsible for delays caused by logistics partners or external factors."
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
            <span className="text-[#00f0ff] font-serif italic text-3xl">05</span>
            Returns & Refunds
          </h2>
          <ul className="space-y-3 list-none pl-0">
            {[
              "Returns are accepted within 7 days.",
              "Items must be unused and in original condition.",
              "Refunds are processed to the original payment method."
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
            <span className="text-[#00f0ff] font-serif italic text-3xl">06</span>
            Prohibited Activities
          </h2>
          <p className="text-[#b9cacb] leading-relaxed mb-4">You agree not to:</p>
          <ul className="space-y-3 list-none pl-0">
            {[
              "Use the platform for illegal purposes",
              "Attempt to hack, disrupt, or misuse the system",
              "Upload harmful or malicious content"
            ].map((item, i) => (
              <li key={i} className="flex gap-4 text-[#b9cacb]">
                <span className="text-[#ea4335] mt-1.5 shrink-0">
                    <span className="material-symbols-outlined text-sm">block</span>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4 flex items-center gap-3">
            <span className="text-[#00f0ff] font-serif italic text-3xl">07</span>
            Governing Law
          </h2>
          <p className="text-[#b9cacb] leading-relaxed">
            These Terms are governed by the laws of India.
          </p>
        </section>

        <section className="pt-12 border-t border-white/5">
            <div className="p-8 rounded-3xl bg-[#131313] border border-[#00f0ff]/10">
                <h2 className="text-xl font-black text-[#E5E2E1] mb-4">Contact Us</h2>
                <p className="text-[#b9cacb] text-sm leading-relaxed mb-6">
                    For any questions regarding these Terms, please reach out to our legal team:
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

export default TermsOfService;
