import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Wand2 } from 'lucide-react';

export const ChatInput = ({ onSend, isLoading, status = "Synthesizing" }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="relative group/input">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2.5 glass rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center gap-1 h-4">
              {[0.4, 0.7, 1, 0.6, 0.9, 0.4].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ["30%", "100%", "30%"],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-0.5 bg-(--link-color) rounded-full"
                />
              ))}
            </div>
            <motion.span
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-clip-text text-transparent bg-linear-to-r from-(--link-color) to-(--accent-color) uppercase italic"
            >
              {status}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass p-2 rounded-2xl flex items-center gap-3 relative shadow-xl ring-1 ring-(--glass-border) hover:ring-(--link-color)/30 transition-all duration-700"
      >
        <div className="pl-4 text-(--link-color)/60 group-focus-within/input:text-(--link-color) transition-colors duration-500">
          <Wand2 size={18} />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="flex-1 bg-transparent py-3 text-sm font-medium focus:outline-none placeholder:text-(--text-secondary)/40 disabled:opacity-50 transition-all"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl shadow-lg text-white transition-all duration-500 group relative overflow-hidden ${
              input.trim() ? 'bg-linear-to-tr from-(--link-color) to-(--accent-color)' : 'bg-slate-300 dark:bg-slate-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
            <Send size={16} className="relative z-10" />
          </motion.button>
        </form>
      </motion.div>

      <div className="absolute inset-0 bg-linear-to-r from-(--link-color)/5 to-transparent blur-2xl rounded-full opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-1000 -z-10" />
    </div>
  );
};