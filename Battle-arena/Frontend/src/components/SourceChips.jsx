import { motion } from 'framer-motion';
import { Link2 } from 'lucide-react';

export const SourceChips = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-2 mt-4"
    >
      <span className="text-[8px] font-black uppercase tracking-widest text-(--text-secondary) opacity-40">
        Sources
      </span>
      {sources.slice(0, 4).map((source, i) => (
        <a
          key={i}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full glass text-[9px] font-bold text-(--text-secondary) hover:text-(--link-color) transition-colors max-w-[160px]"
          title={source.title}
        >
          <Link2 size={10} className="shrink-0" />
          <span className="truncate">{source.title}</span>
        </a>
      ))}
    </motion.div>
  );
};