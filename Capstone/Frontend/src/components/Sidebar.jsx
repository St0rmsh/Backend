import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Check } from 'lucide-react';

export default function Sidebar({ sandboxId, onInvokeAi }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI assistant. How can I help you build your project today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgress, setCurrentProgress] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sandboxId || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentProgress('');

    try {
      await onInvokeAi(userMessage, (content, type) => {
        if (type === 'progress') {
          setCurrentProgress(content);
        } else if (type === 'text-chunk') {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === 'ai-stream') {
               return [...prev.slice(0, -1), { role: 'ai-stream', content: lastMessage.content + content }];
            } else {
               return [...prev, { role: 'ai-stream', content: content }];
            }
          });
        } else if (type === 'text-full') {
          setMessages((prev) => {
            const withoutStream = prev.filter(m => m.role !== 'ai-stream');
            return [...withoutStream, { role: 'ai-stream', content: content }];
          });
        }
      }, (finalMessage) => {
        setCurrentProgress('');
        setMessages((prev) => {
          const withoutStream = prev.filter(m => m.role !== 'ai-stream');
          let content = finalMessage;
          if (!content) {
            const streamMsg = prev.find(m => m.role === 'ai-stream');
            content = streamMsg ? streamMsg.content : '';
          }
          return [...withoutStream, { role: 'ai', content: content }];
        });
        setIsLoading(false);
      });
    } catch (error) {
      console.error("AI invocation error:", error);
      setCurrentProgress('');
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 h-full glass-panel flex flex-col overflow-hidden shrink-0">
      <div className="px-4 py-3 border-b border-white/5 bg-surface/50 flex items-center">
        <Bot size={18} className="text-primary mr-2" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-on-surface">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`flex items-start space-x-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-surface-highest text-on-surface-variant'}`}>
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div 
                className={`p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-on-primary rounded-tr-sm' 
                    : 'bg-surface-highest/50 border border-white/5 text-on-surface rounded-tl-sm w-full overflow-hidden'
                }`}
              >
                {msg.role === 'user' ? msg.content : <Markdown text={msg.content} />}
              </div>
            </div>
          </div>
        ))}
        {isLoading && !currentProgress && (
          <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {currentProgress && (
        <div className="px-4 py-2 border-t border-white/5 bg-surface/30 flex items-center space-x-2 text-xs text-primary animate-pulse">
          <Loader2 size={12} className="animate-spin text-primary shrink-0" />
          <span className="truncate">{currentProgress}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-surface-lowest">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!sandboxId || isLoading}
            placeholder={sandboxId ? "Ask me to build something..." : "Start a sandbox first"}
            className="w-full bg-surface border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!sandboxId || !input.trim() || isLoading}
            className="absolute right-1 p-1.5 text-primary hover:bg-primary/10 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

// Markdown Parser Helper Components
function Markdown({ text }) {
  if (!text) return null;
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="markdown-content space-y-2 text-left">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : part.slice(3, -3);
          return <CodeBlock key={index} code={code} language={lang} />;
        } else {
          return <TextSection key={index} text={part} />;
        }
      })}
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-white/10 bg-[#080a0f] text-xs max-w-full">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0d1117] border-b border-white/5 text-gray-400 font-mono text-[10px]">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 hover:text-primary transition-colors focus:outline-none cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={10} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={10} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto font-mono text-white/90 leading-normal whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function TextSection({ text }) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const trimmedPara = para.trim();
        if (!trimmedPara) return null;

        const lines = trimmedPara.split('\n');
        const isBulletList = lines.every(line => /^\s*[-*]\s+/.test(line));
        const isNumList = lines.every(line => /^\s*\d+\.\s+/.test(line));

        if (isBulletList) {
          return (
            <ul key={pIdx} className="list-disc pl-5 space-y-1 my-1">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>
                  <InlineFormatter text={line.replace(/^\s*[-*]\s+/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        if (isNumList) {
          return (
            <ol key={pIdx} className="list-decimal pl-5 space-y-1 my-1">
              {lines.map((line, lIdx) => (
                <li key={lIdx}>
                  <InlineFormatter text={line.replace(/^\s*\d+\.\s+/, '')} />
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={pIdx} className="my-1 leading-relaxed break-words">
            {lines.map((line, lIdx) => (
              <span key={lIdx} className={lIdx > 0 ? "block mt-1" : ""}>
                <InlineFormatter text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

function InlineFormatter({ text }) {
  if (!text) return null;
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        } else if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="px-1 py-0.5 rounded bg-white/10 border border-white/5 font-mono text-xs text-primary">{part.slice(1, -1)}</code>;
        } else {
          return part;
        }
      })}
    </>
  );
}
