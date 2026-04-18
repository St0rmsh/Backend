import { motion } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

const TrustMeter = ({ score = 0, type = "trust" }) => {
  const isTrust = type === "trust";
  const normalizedScore = Math.min(100, Math.max(0, score * 100));
  
  const getColor = () => {
    if (isTrust) {
      if (normalizedScore > 80) return "var(--color-brand-green)";
      if (normalizedScore > 50) return "var(--color-brand-earth)";
      return "var(--color-brand-red)";
    } else {
      // For AI Generation
      if (normalizedScore > 70) return "var(--color-brand-orange)";
      return "var(--color-brand-tan)";
    }
  };

  const color = getColor();

  return (
    <div className="glass rounded-[2rem] p-6 border border-main shadow-sm relative overflow-hidden group">
      {/* BACKGROUND DECORATION */}
      <div className="absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-10 transition-all duration-700 group-hover:opacity-20" style={{ background: color }} />

      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* RADIAL TRACK */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64" cy="64" r="58"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-black/5"
            />
            {/* RADIAL PROGRESS */}
            <motion.circle
              cx="64" cy="64" r="58"
              fill="transparent"
              stroke={color}
              strokeWidth="6"
              strokeDasharray="364.4"
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * normalizedScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display font-black text-3xl tracking-tighter text-main">
              {Math.round(normalizedScore)}<span className="text-sm opacity-50">%</span>
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted">
              {isTrust ? "Confidence" : "Synthetic"}
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
              <span className="text-[10px] font-black uppercase tracking-widest text-main">
                {isTrust ? "Fact Check" : "Neural Analysis"}
              </span>
            </div>
          </div>
          
          <p className="text-[10px] text-muted leading-relaxed font-bold italic">
            {isTrust 
              ? "Verified against cross-referenced archival datasets."
              : "Detected algorithmic patterns consistent with AI synthesis."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
