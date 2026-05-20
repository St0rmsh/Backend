import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function Sidebar({ sandboxId, onInvokeAi }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am your AI assistant. How can I help you build your project today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      await onInvokeAi(userMessage, (chunk) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.role === 'ai-stream') {
             return [...prev.slice(0, -1), { role: 'ai-stream', content: lastMessage.content + chunk }];
          } else {
             return [...prev, { role: 'ai-stream', content: chunk }];
          }
        });
      }, (finalMessage) => {
        setMessages((prev) => {
          // Replace stream with final message if needed, or just keep it
          // Assuming the stream builds the full response
          const withoutStream = prev.filter(m => m.role !== 'ai-stream');
          return [...withoutStream, { role: 'ai', content: finalMessage }];
        });
        setIsLoading(false);
      });
    } catch (error) {
      console.error("AI invocation error:", error);
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
                    : 'bg-surface-highest/50 border border-white/5 text-on-surface rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
