import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Trophy, Star, AlertTriangle, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const cardSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1
};

export const SolutionCard = ({ title, content, score, reasoning, isPrimary, failed, retrying, streaming }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const percentage = (score / 10) * 100;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={cardSpring}
      className={`p-8 rounded-3xl relative group glass transition-all duration-500 overflow-hidden cursor-default ${
        failed
          ? 'opacity-60 grayscale ring-1 ring-red-500/20'
          : isPrimary
            ? 'premium-shadow ring-2 ring-(--link-color)/40 shadow-(--link-color)/10'
            : 'shadow-md opacity-90'
      }`}
    >
      {/* Background Cinematic Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className={`absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 rounded-full blur-3xl ${
          failed ? 'bg-red-500' : isPrimary ? 'bg-(--link-color)' : 'bg-slate-500'
        }`}
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl glass ${failed ? 'text-red-500' : isPrimary ? 'text-(--link-color)' : 'text-slate-400'}`}>
            {failed ? <AlertTriangle size={20} /> : isPrimary ? <Trophy size={20} /> : <Star size={20} />}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-(--text-secondary) mb-1">
              {title}
            </h3>
            {failed ? (
              <span className="text-[10px] font-black py-0.5 px-2 bg-red-500/10 text-red-500 rounded-full uppercase tracking-tighter">
                Unavailable
              </span>
            ) : isPrimary && !streaming && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-black py-0.5 px-2 bg-linear-to-r from-(--link-color) to-(--accent-color) text-white rounded-full uppercase tracking-tighter"
              >
                Top Rated Choice
              </motion.span>
            )}
          </div>
        </div>
        {!failed && !streaming && (
          <button
            onClick={handleCopy}
            className="p-3 rounded-2xl glass hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 transform active:scale-90 text-(--text-secondary)"
            aria-label="Copy solution"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </button>
        )}
      </div>

      {/* Score Progress Bar — hidden while still streaming, since score isn't known yet */}
      {!streaming && (
        <div className="mt-10 mb-8 relative z-10">
          <div className="flex justify-between items-end mb-3">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black tracking-tighter"
            >
              {score}<span className="text-xl opacity-30 px-1">/10</span>
            </motion.span>
            <span className="text-[10px] font-black text-(--text-secondary) uppercase tracking-widest opacity-60">
              Efficiency Rating
            </span>
          </div>
          <div className="h-3 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden p-1">
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1] }}
               className={`h-1.5 rounded-full shadow-lg ${failed ? 'bg-red-400' : isPrimary ? 'bg-linear-to-r from-(--link-color) to-(--accent-color)' : 'bg-slate-400'}`}
             />
          </div>
        </div>
      )}

      {retrying ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center relative z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <RotateCcw size={20} className="text-amber-500" />
          </motion.div>
          <p className="text-xs font-semibold text-amber-500">Connection dropped — retrying...</p>
        </div>
      ) : failed ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center relative z-10">
          <AlertTriangle size={28} className="text-red-500/40" />
          <p className="text-xs font-semibold text-(--text-secondary) leading-relaxed max-w-xs">
            This model didn't respond after several attempts. The other solution was accepted by default.
          </p>
        </div>
      ) : (
        <div className="prose dark:prose-invert prose-sm max-w-none text-(--text-primary) leading-relaxed relative z-10 markdown-content overflow-hidden">
          <ReactMarkdown>{content}</ReactMarkdown>
          {streaming && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-4 bg-(--link-color) ml-0.5 align-middle"
            />
          )}
        </div>
      )}

      {!streaming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 pt-6 border-t border-(--glass-border) relative z-10"
        >
          <p className="text-xs font-semibold text-(--text-secondary) leading-relaxed italic flex gap-3">
            <span className="text-2xl leading-none text-(--link-color)/30 font-serif">&ldquo;</span>
            {reasoning}
            <span className="text-2xl leading-none self-end text-(--link-color)/30 font-serif">&rdquo;</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
