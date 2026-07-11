import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Loader2,
  Wand2,
  X,
  ArrowUp,
} from "lucide-react";

const suggestions = [
  "Write Merge Sort in JavaScript",
  "Optimize Dijkstra Algorithm",
  "Build JWT Authentication in Node.js",
  "React Infinite Scroll",
];

export default function ChatInput({
  onSend,
  isLoading,
}) {
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    autoResize();
  }, [message]);

  const autoResize = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      220
    )}px`;
  };

  const send = () => {
    if (!message.trim()) return;
    if (isLoading) return;

    onSend(message.trim());

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="w-full relative">

      {/* Glow */}

      <div className="absolute inset-0 blur-3xl bg-indigo-500/10 rounded-full pointer-events-none" />

      {/* Suggestions */}

      <AnimatePresence>

        {!message && !focused && !isLoading && (

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 10,
            }}
            className="mb-5 flex flex-wrap gap-2 justify-center"
          >

            {suggestions.map((item) => (

              <motion.button
                key={item}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => setMessage(item)}
                className="glass px-4 py-2 rounded-full text-xs font-semibold transition hover:border-indigo-500"
              >
                {item}
              </motion.button>

            ))}

          </motion.div>

        )}

      </AnimatePresence>

      <motion.div
        layout
        className={`glass rounded-3xl border transition-all duration-500 ${
          focused
            ? "border-indigo-500 shadow-[0_0_35px_rgba(99,102,241,.25)]"
            : "border-white/10"
        }`}
      >

        <div className="flex items-end gap-4 p-4">

          {/* AI Icon */}

          <motion.div
            animate={{
              rotate: isLoading
                ? 360
                : 0,
            }}
            transition={{
              duration: 3,
              repeat: isLoading
                ? Infinity
                : 0,
              ease: "linear",
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shrink-0"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
          </motion.div>

          {/* Textarea */}

          <div className="flex-1">

            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              disabled={isLoading}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask Battle Arena anything..."
              className="w-full bg-transparent resize-none outline-none text-sm leading-7 placeholder:text-gray-400 max-h-[220px]"
            />

            <div className="mt-3 flex items-center justify-between">

              <div className="flex items-center gap-3 text-xs text-gray-400">

                <div className="flex items-center gap-1">

                  <Wand2 size={13} />

                  AI Battle

                </div>

                <div>

                  {message.length}/4000

                </div>

              </div>

              <div className="text-xs text-gray-400">

                Enter ↵ Send

              </div>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-col gap-2">

            {message && (

              <motion.button
                whileTap={{
                  scale: .9,
                }}
                onClick={() => setMessage("")}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center"
              >
                <X size={16} />
              </motion.button>

            )}

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: .9,
              }}
              onClick={send}
              disabled={
                !message.trim() ||
                isLoading
              }
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300

${
  message.trim()
    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-xl"
    : "bg-gray-800 text-gray-500 cursor-not-allowed"
}
`}
            >

              {isLoading ? (

                <Loader2
                  size={18}
                  className="animate-spin"
                />

              ) : (

                <ArrowUp size={18} />

              )}

            </motion.button>

          </div>

        </div>

      </motion.div>

      {/* Bottom Hint */}

      <AnimatePresence>

        {focused && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="mt-3 text-center text-xs text-gray-500"
          >

            Press <b>Enter</b> to send • <b>Shift + Enter</b> for new line

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}