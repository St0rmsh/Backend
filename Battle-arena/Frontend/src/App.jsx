import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Brain, Zap, Shield, Trophy, Sparkles, RotateCcw, MessageSquareText, PanelLeftOpen } from 'lucide-react';
import { SolutionCard } from './components/SolutionCard';
import { JudgeSection } from './components/JudgeSection';
import { ChatInput } from './components/ChatInput';
import { ThemeToggle } from './components/ThemeToggle';
import { Sidebar } from './components/Sidebar';
import { SourceChips } from './components/SourceChips';

const API_BASE = 'https://backend-m8c6.onrender.com';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

const emptyJudge = {
  solution_1_score: 0,
  solution_2_score: 0,
  solution_1_reasoning: "",
  solution_2_reasoning: "",
};

function App() {
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Synthesizing");
  const [error, setError] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    refreshThreads();
  }, []);

  const refreshThreads = async () => {
    setThreadsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/threads`);
      const json = await res.json();
      if (json.success) setThreads(json.data);
    } catch (err) {
      console.error("Failed to load threads:", err);
    } finally {
      setThreadsLoading(false);
    }
  };

  const handleSend = async (problem) => {
    setLoading(true);
    setError(null);
    setStatus("Searching the web");

    const messageId = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        problem,
        solution_1: "",
        solution_2: "",
        solution_1_failed: false,
        solution_2_failed: false,
        solution_1_retrying: false,
        solution_2_retrying: false,
        search_sources: [],
        judge: emptyJudge,
      },
    ]);

    const updateMessage = (patch) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m))
      );
    };

    // Token buffer — accumulate here, flush to React state on an
    // interval instead of on every single chunk. Prevents a full
    // list re-render per token, which was causing the lag.
    const pendingText = { solution_1: "", solution_2: "" };
    let flushTimer = null;

    const scheduleFlush = () => {
      if (flushTimer) return;
      flushTimer = setTimeout(() => {
        const toFlush = { ...pendingText };
        pendingText.solution_1 = "";
        pendingText.solution_2 = "";
        flushTimer = null;

        updateMessage((m) => ({
          solution_1: toFlush.solution_1 ? m.solution_1 + toFlush.solution_1 : m.solution_1,
          solution_2: toFlush.solution_2 ? m.solution_2 + toFlush.solution_2 : m.solution_2,
        }));
      }, 60);
    };

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: problem, threadId }),
      });

      if (!response.ok || !response.body) throw new Error("Stream request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          if (!raw.trim()) continue;

          const eventLine = raw.split("\n").find((l) => l.startsWith("event:"));
          const dataLine = raw.split("\n").find((l) => l.startsWith("data:"));
          if (!eventLine || !dataLine) continue;

          const event = eventLine.replace("event:", "").trim();

          let data;
          try {
            data = JSON.parse(dataLine.replace("data:", "").trim());
          } catch (parseErr) {
            console.error("Failed to parse SSE chunk:", parseErr, dataLine);
            continue;
          }

          if (event === "thread") {
            if (data.threadId) setThreadId(data.threadId);
          } else if (event === "token") {
            if (data.stage === "search") {
              if (data.type === "start") setStatus("Searching the web");
              if (data.type === "done" || data.type === "failed") setStatus("Synthesizing");
            } else {
              const key = data.model;
              if (data.type === "token") {
                setStatus("Synthesizing");
                pendingText[key] += data.text;
                scheduleFlush();
              } else if (data.type === "retry") {
                pendingText[key] = "";
                updateMessage(() => ({ [key]: "", [`${key}_retrying`]: true }));
              } else if (data.type === "done") {
                updateMessage(() => ({ [`${key}_retrying`]: false }));
                setStatus("Judging");
              } else if (data.type === "failed") {
                updateMessage(() => ({ [`${key}_failed`]: true, [`${key}_retrying`]: false }));
              }
            }
          } else if (event === "state") {
            updateMessage(() => ({
              judge: data.judgement,
              solution_1_failed: data.solution_1_failed,
              solution_2_failed: data.solution_2_failed,
              search_sources: data.search_sources || [],
            }));
          } else if (event === "error") {
            setError(data.message || "Something went wrong. Please try again.");
          }
        }
      }

      if (flushTimer) clearTimeout(flushTimer);
      updateMessage((m) => ({
        solution_1: pendingText.solution_1 ? m.solution_1 + pendingText.solution_1 : m.solution_1,
        solution_2: pendingText.solution_2 ? m.solution_2 + pendingText.solution_2 : m.solution_2,
      }));

      refreshThreads();
    } catch (err) {
      console.error("❌ Stream error:", err);
      setError("Something went wrong reaching the arena. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setThreadId(null);
    setMessages([]);
    setError(null);
    setSidebarOpen(false);
  };

  const handleSelectThread = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/threads/${id}`);
      const json = await res.json();
      if (json.success) {
        const loaded = json.data.map((turn, i) => ({
          id: `${id}-${i}`,
          problem: turn.problem,
          solution_1: turn.solution_1,
          solution_2: turn.solution_2,
          solution_1_failed: turn.solution_1_failed,
          solution_2_failed: turn.solution_2_failed,
          solution_1_retrying: false,
          solution_2_retrying: false,
          search_sources: turn.search_sources || [],
          judge: turn.judgement,
        }));
        setMessages(loaded);
        setThreadId(id);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to load thread:", err);
      setError("Couldn't load that conversation.");
    } finally {
      setSidebarOpen(false);
    }
  };

  const handleRenameThread = async (id, title) => {
    setThreads((prev) => prev.map((t) => (t.threadId === id ? { ...t, title } : t)));
    try {
      await fetch(`${API_BASE}/threads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } catch (err) {
      console.error("Rename failed:", err);
      refreshThreads();
    }
  };

  const handleDeleteThread = async (id) => {
    setThreads((prev) => prev.filter((t) => t.threadId !== id));
    if (id === threadId) handleNewConversation();
    try {
      await fetch(`${API_BASE}/threads/${id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete failed:", err);
      refreshThreads();
    }
  };

  return (
    <div className="min-h-screen relative selection:bg-(--link-color)/30 bg-(--bg-color) seamless-scroll font-sans">
      <div className="mesh-gradient" />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        threads={threads}
        currentThreadId={threadId}
        onSelectThread={handleSelectThread}
        onNewConversation={handleNewConversation}
        onRenameThread={handleRenameThread}
        onDeleteThread={handleDeleteThread}
        isLoading={threadsLoading}
      />

      <header className="sticky top-0 z-30 glass border-b border-(--glass-border) backdrop-blur-3xl px-6 py-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl glass text-(--text-secondary) hover:text-(--link-color) transition-colors"
              aria-label="Open history"
            >
              <PanelLeftOpen size={16} />
            </button>

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
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex gap-6 text-[9px] font-black uppercase tracking-widest text-(--text-secondary) opacity-40">
              <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Zap size={10} /> Realtime</span>
              <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Shield size={10} /> Secure</span>
              <span className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"><Trophy size={10} /> Optimized</span>
            </div>

            <AnimatePresence>
              {threadId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-[9px] font-black uppercase tracking-widest text-emerald-500"
                  title={`Thread: ${threadId}`}
                >
                  <MessageSquareText size={11} />
                  Memory Active
                </motion.div>
              )}
            </AnimatePresence>

            {messages.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewConversation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass text-[9px] font-black uppercase tracking-widest text-(--text-secondary) hover:text-(--link-color) transition-colors"
              >
                <RotateCcw size={12} /> New
              </motion.button>
            )}

            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
      </header>

      <LayoutGroup>
        <main className="breathing-space pt-10 pb-40">

          {messages.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center text-center gap-6 py-32"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="p-5 bg-linear-to-br from-(--link-color) to-(--accent-color) rounded-3xl text-white shadow-xl shadow-(--link-color)/20"
              >
                <Brain size={32} />
              </motion.div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-xl font-black tracking-tighter uppercase">Pose a Technical Challenge</h2>
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  Two models compete, a third judges — grounded in live web search,
                  with the conversation remembered across turns.
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto mb-8 px-5 py-3 rounded-2xl glass border border-red-500/20 text-red-500 text-sm font-semibold text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <section className="space-y-24">
            <AnimatePresence mode="popLayout" initial={false}>
              {messages.map((msg, index) => {
                const isLastMessage = index === messages.length - 1;
                const isStreamingThis = loading && isLastMessage;

                return (
                  <motion.div
                    key={msg.id}
                    layout="position"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-10 relative"
                  >
                    <motion.div variants={itemVariants} className="flex flex-col items-center">
                      <div className="p-1 px-1.5 bg-linear-to-tr from-(--glass-border) to-(--link-color)/15 rounded-2xl shadow-lg">
                        <div className="px-6 py-4 bg-(--bg-color) dark:bg-slate-900 rounded-2xl max-w-2xl text-center shadow-inner relative overflow-hidden group">
                          <div className="absolute inset-0 bg-(--link-color)/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl rounded-full" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-(--link-color) mb-2 block relative z-10 opacity-50">
                            {index === 0 ? 'Technical Challenge' : `Follow-up · Turn ${index + 1}`}
                          </span>
                          <h2 className="text-lg font-bold tracking-tight text-(--text-primary) relative z-10 text-pretty">
                            {msg.problem}
                          </h2>
                        </div>
                      </div>
                      <SourceChips sources={msg.search_sources} />
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
                        failed={msg.solution_1_failed}
                        retrying={msg.solution_1_retrying}
                        streaming={isStreamingThis && !msg.solution_1_failed && !msg.judge.solution_1_score && !msg.judge.solution_2_score}
                      />
                      <SolutionCard
                        title="Solution Beta"
                        content={msg.solution_2}
                        score={msg.judge.solution_2_score}
                        reasoning={msg.judge.solution_2_reasoning}
                        isPrimary={msg.judge.solution_2_score > msg.judge.solution_1_score}
                        failed={msg.solution_2_failed}
                        retrying={msg.solution_2_retrying}
                        streaming={isStreamingThis && !msg.solution_2_failed && !msg.judge.solution_1_score && !msg.judge.solution_2_score}
                      />
                    </motion.div>

                    {(msg.judge.solution_1_score > 0 || msg.judge.solution_2_score > 0) && (
                      <motion.div variants={itemVariants}>
                        <JudgeSection judgeData={msg.judge} />
                      </motion.div>
                    )}

                    {isLastMessage && <div ref={scrollRef} />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </section>
        </main>
      </LayoutGroup>

      <footer className="fixed bottom-0 left-0 w-full p-8 z-40 bg-linear-to-t from-(--bg-color) via-(--bg-color)/80 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <ChatInput onSend={handleSend} isLoading={loading} status={status} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 flex justify-center gap-8 opacity-20"
          >
             <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 border-r border-(--glass-border) pr-8 hover:opacity-100 transition-opacity"><Sparkles size={10} className="text-yellow-500" /> Mistral Medium-Latest Connected</div>
             <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity"><Sparkles size={10} className="text-purple-500" />Cohere Command-a-03-2025 Linked</div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

export default App;