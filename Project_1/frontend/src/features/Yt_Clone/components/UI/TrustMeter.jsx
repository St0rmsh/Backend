import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, Zap, TrendingUp } from "lucide-react";

const TrustMeter = ({ score = 0, type = "trust" }) => {
  const isTrust = type === "trust";
  const normalizedScore = Math.min(100, Math.max(0, score * 100));
  
  const getColor = () => {
    if (isTrust) {
      if (normalizedScore > 80) return "var(--color-brand-emerald)";
      if (normalizedScore > 50) return "var(--color-brand-amber)";
      return "var(--color-brand-crimson)";
    } else {
      // For Deepfake/AI Gen, higher score is often more "suspicious" or just "AI made"
      if (normalizedScore > 70) return "var(--color-brand-purple)";
      return "var(--color-brand-indigo)";
    }
  };

  const color = getColor();

  return (
    <div className="glass-heavy rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
      {/* BACKGROUND DECORATION */}
      <div className="absolute -top-10 -right-10 w-32 h-32 blur-[50px] opacity-20 transition-all duration-700 group-hover:opacity-40" style={{ background: color }} />

      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* RADIAL TRACK */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64" cy="64" r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/5"
            />
            {/* RADIAL PROGRESS */}
            <motion.circle
              cx="64" cy="64" r="58"
              fill="transparent"
              stroke={color}
              strokeWidth="8"
              strokeDasharray="364.4"
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * normalizedScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
              className="ai-glow-indigo"
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-black text-3xl tracking-tighter text-main">
              {Math.round(normalizedScore)}<span className="text-sm opacity-50">%</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">
              {isTrust ? "Trust Index" : "AI Clarity"}
            </span>
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isTrust ? (
                <ShieldCheck className="w-4 h-4" style={{ color }} />
              ) : (
                <Zap className="w-4 h-4" style={{ color }} />
              )}
              <span className="text-xs font-bold text-main">
                {isTrust ? "Veracity Analysis" : "Content Synthesis"}
              </span>
            </div>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
              style={{ backgroundColor: color }}
            >
              Live Monitor
            </motion.div>
          </div>
          
          <p className="text-[11px] text-muted leading-relaxed font-medium">
            {isTrust 
              ? "Verified against global datasets and real-time fact-checking nodes."
              : "Spectral analysis detected patterns consistent with generative neural networks."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
