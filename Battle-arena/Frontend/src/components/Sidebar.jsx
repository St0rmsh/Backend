import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Pencil, Trash2, Plus, X, Check, PanelLeftClose } from 'lucide-react';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const Sidebar = ({
  isOpen,
  onClose,
  threads,
  currentThreadId,
  onSelectThread,
  onNewConversation,
  onRenameThread,
  onDeleteThread,
  isLoading,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const startEditing = (thread) => {
    setEditingId(thread.threadId);
    setEditValue(thread.title);
  };

  const commitEdit = (threadId) => {
    if (editValue.trim()) {
      onRenameThread(threadId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          />

          <motion.aside
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
            className="fixed top-0 left-0 h-screen w-80 z-50 glass border-r border-(--glass-border) flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-(--glass-border)">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-(--text-secondary)">
                Conversations
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-(--glass-border) transition-colors text-(--text-secondary)"
                aria-label="Close sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            </div>

            <div className="p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNewConversation}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-linear-to-tr from-(--link-color) to-(--accent-color) text-white text-xs font-black uppercase tracking-widest shadow-lg"
              >
                <Plus size={14} /> New Conversation
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto sidebar-scroll px-3 pb-4 space-y-1">
              {isLoading && (
                <p className="text-center text-[10px] text-(--text-secondary) opacity-50 py-8 uppercase tracking-widest">
                  Loading...
                </p>
              )}

              {!isLoading && threads.length === 0 && (
                <p className="text-center text-[10px] text-(--text-secondary) opacity-50 py-8 uppercase tracking-widest">
                  No conversations yet
                </p>
              )}

              {threads.map((thread) => (
                <div
                  key={thread.threadId}
                  className={`group relative rounded-2xl transition-colors ${
                    thread.threadId === currentThreadId
                      ? 'bg-(--link-color)/10 ring-1 ring-(--link-color)/30'
                      : 'hover:bg-(--glass-border)'
                  }`}
                >
                  {editingId === thread.threadId ? (
                    <div className="flex items-center gap-1 p-2">
                      <input
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit(thread.threadId);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 bg-(--bg-color) rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none ring-1 ring-(--link-color)/40"
                      />
                      <button
                        onClick={() => commitEdit(thread.threadId)}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-(--text-secondary) hover:bg-(--glass-border) rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : confirmDeleteId === thread.threadId ? (
                    <div className="flex items-center justify-between gap-2 p-3">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Delete?</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            onDeleteThread(thread.threadId);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-red-500 text-white text-[9px] font-black uppercase"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded-lg bg-(--glass-border) text-[9px] font-black uppercase text-(--text-secondary)"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectThread(thread.threadId)}
                      className="w-full flex items-start gap-2.5 px-3 py-3 text-left"
                    >
                      <MessageSquare size={14} className="mt-0.5 shrink-0 text-(--text-secondary) opacity-60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-(--text-primary) truncate pr-12">
                          {thread.title}
                        </p>
                        <p className="text-[9px] font-semibold text-(--text-secondary) opacity-50 mt-0.5 uppercase tracking-wide">
                          {formatDate(thread.updatedAt)} · {thread.turnCount} turn{thread.turnCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </button>
                  )}

                  {editingId !== thread.threadId && confirmDeleteId !== thread.threadId && (
                    <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                      <button
                        onClick={() => startEditing(thread)}
                        className="p-1.5 rounded-lg glass hover:text-(--link-color) text-(--text-secondary) transition-colors"
                        aria-label="Rename"
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(thread.threadId)}
                        className="p-1.5 rounded-lg glass hover:text-red-500 text-(--text-secondary) transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};