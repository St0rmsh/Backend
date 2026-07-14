import { CheckCircle, Trophy, Sparkles, Award } from 'lucide-react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const springConfig = { type: "spring", stiffness: 100, damping: 20 };

export const JudgeSection = ({ judgeData }) => {
  const winner = judgeData.solution_1_score >= judgeData.solution_2_score ? 1 : 2;
  const winningScore = winner === 1 ? judgeData.solution_1_score : judgeData.solution_2_score;

  const [displayScore, setDisplayScore] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    const controls = animate(count, winningScore, {
      duration: 2,
      ease: "easeOut",
      delay: 0.8,
      onUpdate: (latest) => setDisplayScore(latest.toFixed(1))
    });
    return controls.stop;
  }, [winningScore]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={springConfig}
      className="p-8 mt-12 relative glass rounded-3xl overflow-hidden shadow-xl border border-(--link-color)/20"
    >
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-(--link-color)/5 blur-[100px] -z-10 rounded-full"
      />

      <div className="flex flex-col items-center text-center gap-6 relative z-10">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          whileInView={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
          className="p-4 bg-linear-to-br from-(--link-color) to-(--accent-color) rounded-2xl text-white shadow-lg shadow-(--link-color)/20"
        >
          <Trophy size={32} className="drop-shadow-md" />
        </motion.div>

        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
             <Sparkles className="text-(--accent-color)" size={20} />
             <h2 className="text-2xl font-black tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) to-(--text-secondary)">
               The Final Decision
             </h2>
             <Sparkles className="text-(--accent-color)" size={20} />
          </motion.div>
          <p className="text-(--text-secondary) max-w-lg mx-auto font-semibold leading-relaxed text-sm">
            Solution {winner === 1 ? 'Alpha' : 'Beta'} secured the victory through superior technical implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.5fr] gap-10 w-full mt-6 max-w-4xl mx-auto items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex flex-col items-center justify-center p-8 bg-linear-to-br from-(--link-color) to-(--primary-dim) rounded-3xl text-white shadow-xl transform relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            <div className="relative z-10 text-[10px] font-black tracking-[0.3em] uppercase mb-2 opacity-70">
              Final Score
            </div>
            <motion.div className="relative z-10 text-6xl font-black tracking-tighter mb-2 flex items-baseline">
              {displayScore}
              <span className="text-lg font-bold opacity-30 px-1">PT</span>
            </motion.div>
            <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-md">
              <Award size={14} /> Certified Quality
            </div>
          </motion.div>

          <div className="flex flex-col justify-center gap-6 text-left border-l-2 border-(--glass-border) pl-10">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <span className="text-[9px] font-black tracking-[0.2em] text-(--link-color) uppercase block border-b border-(--link-color)/10 pb-1">Winning Merit</span>
              <p className="text-sm leading-relaxed text-(--text-primary) font-medium italic">
                &ldquo;{winner === 1 ? judgeData.solution_1_reasoning : judgeData.solution_2_reasoning}&rdquo;
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-2 opacity-50"
            >
              <span className="text-[9px] font-black tracking-[0.2em] text-(--text-secondary) uppercase block border-b border-(--text-secondary)/10 pb-1">Deficiency Gap</span>
              <p className="text-xs leading-relaxed text-(--text-secondary) font-medium italic">
                {winner === 1 ? judgeData.solution_2_reasoning : judgeData.solution_1_reasoning}
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6 flex flex-wrap justify-center gap-4"
        >
          {['Logic Verified', 'Scale Ready', 'Edge Optimized'].map((tag, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-[9px] font-black text-(--text-secondary) uppercase tracking-widest hover:text-(--link-color) transition-colors cursor-default">
              <CheckCircle size={12} className="text-emerald-500" />
              {tag}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
