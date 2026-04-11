import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-[-0.04em] text-[#E5E2E1] mb-2 font-headline italic text-transparent bg-clip-text bg-gradient-to-r from-[#E5E2E1] to-[#b9cacb]">Returns & Refunds</h1>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#00f0ff]">
            <span>LAST UPDATED: APRIL 11, 2026</span>
            <span className="w-1 h-1 rounded-full bg-[#00f0ff]"></span>
            <span>RET-300-X</span>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-6">Return Eligibility</h2>
          <div className="p-6 rounded-2xl bg-[#131313] border border-[#00f0ff]/10 space-y-4">
            {[
                "Item is defective, damaged, or incorrect.",
                "Return request is raised within 7 days of delivery.",
                "Item is unused with original packaging."
            ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                    <span className="w-5 h-5 rounded-full bg-[#00f0ff]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[#00f0ff] text-[10px] font-bold">{i+1}</span>
                    </span>
                    <p className="text-[#b9cacb] text-sm leading-relaxed">{text}</p>
                </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4">Refund Timelines</h2>
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left bg-[#1c1b1b]/50">
                <thead className="bg-[#131313]">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#b9cacb]">Payment Method</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#b9cacb]">estimated time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    <tr>
                        <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">UPI / Wallet</td>
                        <td className="px-6 py-4 text-sm text-[#00f0ff]">2–5 Business Days</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Credit / Debit Card</td>
                        <td className="px-6 py-4 text-sm text-[#00f0ff]">5–7 Business Days</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 text-sm font-bold text-[#e5e2e1]">Cash on Delivery (COD)</td>
                        <td className="px-6 py-4 text-sm text-[#00f0ff]">Bank Transfer (3-5 Days)</td>
                    </tr>
                </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-[#E5E2E1] mb-4">Non-Returnable Items</h2>
          <div className="flex flex-wrap gap-2">
            {["Innerwear", "Personal Care", "Gift Cards", "Items marked 'Non-Returnable'"].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#ea4335]/5 border border-[#ea4335]/20 text-[10px] font-bold text-[#ffb4ab]">{tag}</span>
            ))}
          </div>
        </section>

        <section className="pt-12 border-t border-white/5">
            <div className="p-8 rounded-3xl bg-[#131313] border border-[#d1bcff]/10">
                <h2 className="text-xl font-black text-[#E5E2E1] mb-4 italic">Cancellation Policy</h2>
                <p className="text-[#b9cacb] text-sm leading-relaxed">
                    Orders can be cancelled anytime before they are shipped. Once the item has left our warehouse, you will need to follow the Return Process after delivery.
                </p>
            </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicy;
