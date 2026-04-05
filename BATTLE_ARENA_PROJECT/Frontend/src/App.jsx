import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Brain, Zap, Shield, Trophy, Sparkles } from 'lucide-react';
import { SolutionCard } from './components/SolutionCard';
import { JudgeSection } from './components/JudgeSection';
import { ChatInput } from './components/ChatInput';
import { ThemeToggle } from './components/ThemeToggle';
import axios from "axios"

// Fine-tuned Spring Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 20 
    }
  }
};

function App() {
  const [messages, setMessages] = useState([
 
  ]);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

const handleSend = async (problem) => {
  setLoading(true);

  try {
    const response = await axios.post("http://localhost:3000/chat", {
      message: problem
    });

    const data = response.data.data;

    const judgeData = data.judge || data.judgement || {};

    const newMessage = {
      id: Date.now(),
      problem: data.problem || problem,
      solution_1: data.solution_1,
      solution_2: data.solution_2,
      judge: {
        solution_1_score: Number(judgeData.solution_1_score ?? 0),
        solution_2_score: Number(judgeData.solution_2_score ?? 0),
        solution_1_reasoning: judgeData.solution_1_reasoning || "",
        solution_2_reasoning: judgeData.solution_2_reasoning || ""
      }
    };

    setMessages((prev) => [...prev, newMessage]);

  } catch (error) {
    console.error("❌ API Error:", error);
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen relative selection:bg-(--link-color)/30 bg-(--bg-color) seamless-scroll font-sans">
      <div className="mesh-gradient" />
      
      {/* Refined Header */}
      <header className="sticky top-0 z-50 glass border-b border-(--glass-border) backdrop-blur-3xl px-6 py-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <motion.div 
             initial={{ x: -10, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="flex items-center gap-3 group cursor-default"
          >
             <div className="p-2 bg-linear-to-tr from-(--link-color) to-(--accent-color) rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                <Brain size={18} />
             </div>
             <div>
                <h1 className="text-base font-black tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-linear-to-r from-(--text-primary) to-(--text-secondary)">Battle Arena</h1>
                <span className="text-[9px] font-bold tracking-widest text-(--link-color)/70 uppercase">Parallel Intelligence</span>
             </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
             <div className="hidden lg:flex gap-6 text-[9px] font-black uppercase tracking-widest text-(--text-secondary) opacity-40">
                <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Zap size={10} /> Realtime</span>
                <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Shield size={10} /> Secure</span>
                <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Trophy size={10} /> Optimized</span>
             </div>
             <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </header>

      <LayoutGroup>
        <main className="breathing-space pt-10 pb-40">
          <section className="space-y-24">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  layout="position"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  className="space-y-10 relative"
                >
                  {/* Scaled Down Problem Card */}
                  <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <div className="p-1 px-1.5 bg-linear-to-tr from-(--glass-border) to-(--link-color)/15 rounded-2xl shadow-lg">
                      <div className="px-6 py-4 bg-(--bg-color) dark:bg-slate-900 rounded-2xl max-w-2xl text-center shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-(--link-color)/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl rounded-full" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-(--link-color) mb-2 block relative z-10 opacity-50">Technical Challenge</span>
                        <h2 className="text-lg font-bold tracking-tight text-(--text-primary) relative z-10 text-pretty">
                          {msg.problem}
                        </h2>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 opacity-20 group">
                     <div className="h-px w-10 bg-linear-to-r from-transparent to-(--text-secondary)" />
                     <div className="text-[8px] font-black tracking-widest uppercase text-(--text-secondary)">Analysis</div>
                     <div className="h-px w-10 bg-linear-to-l from-transparent to-(--text-secondary)" />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                          className="p-2.5 bg-(--bg-color) dark:bg-slate-900 rounded-full border border-(--glass-border) shadow-xl relative"
                        >
                           <div className="absolute inset-0 bg-(--link-color)/5 blur-lg rounded-full animate-pulse" />
                           <div className="relative w-6 h-6 flex items-center justify-center text-[10px] font-black text-(--link-color) uppercase tracking-tighter">VS</div>
                        </motion.div>
                     </div>
                    <SolutionCard
                      title="Solution Alpha"
      content={msg.solution_1}
      score={msg.judge.solution_1_score}
      reasoning={msg.judge.solution_1_reasoning}
      isPrimary={msg.judge.solution_1_score >= msg.judge.solution_2_score}
                    />
                    <SolutionCard
                     title="Solution Beta"
      content={msg.solution_2}
      score={msg.judge.solution_2_score}
      reasoning={msg.judge.solution_2_reasoning}
      isPrimary={msg.judge.solution_2_score > msg.judge.solution_1_score}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <JudgeSection judgeData={msg.judge} />
                  </motion.div>
                  
                  {index === messages.length - 1 && <div ref={scrollRef} />}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div 
                layout="position"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="flex flex-col items-center gap-6 py-16"
              >
                 <div className="relative flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-20 h-20 bg-(--link-color) rounded-full blur-2xl"
                    />
                    <div className="relative">
                       <div className="w-12 h-12 border border-(--glass-border) rounded-full shadow-inner" />
                       <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t border-r border-(--link-color) rounded-full shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                       />
                    </div>
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute text-(--link-color)"
                    >
                      <Brain size={24} />
                    </motion.div>
                 </div>
                 <div className="space-y-3 text-center">
                    <h3 className="text-[10px] font-bold text-(--link-color) tracking-widest uppercase italic">
                      Synthesizing
                    </h3>
                    <div className="flex gap-1.5 justify-center">
                       {[0, 1, 2].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                           className="w-1 h-1 rounded-full bg-(--link-color)"
                         />
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
          </section>
        </main>
      </LayoutGroup>

      {/* Controller Positioning */}
      <footer className="fixed bottom-0 left-0 w-full p-8 z-50 bg-linear-to-t from-(--bg-color) via-(--bg-color)/80 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">

          <ChatInput onSend={handleSend} isLoading={loading} />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 flex justify-center gap-8 opacity-20"
          >
             <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border-r border-(--glass-border) pr-8 hover:opacity-100 transition-opacity"><Sparkles size={10} className="text-yellow-500" /> Mistral Medium-Latest Connected</div>
             <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity"><Sparkles size={10} className="text-purple-500" />Cohere  Command-a-03-2025 Linked</div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;
