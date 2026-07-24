import { useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Play, Loader2, Clock, Link as LinkIcon, Check } from 'lucide-react';
import Sidebar from './components/Sidebar';
import WorkspacePane from './components/WorkspacePane';
import TerminalPane from './components/TerminalPane';
import FileTree from './components/FileTree';
import PresenceBar from './components/PresenceBar';
import './App.css';

const STORAGE_KEY = 'obsidian_sandbox';

function formatTTL(seconds) {
  if (seconds < 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function App() {
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [previewKey, setPreviewKey] = useState(0);
  const [topHeight, setTopHeight] = useState(70);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ttl, setTtl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Fetch the logged-in user's identity once on load (used for presence)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
        }
      } catch (err) {
        console.warn('Not authenticated yet', err);
      }
    };
    fetchMe();
  }, []);

  const connectSocket = useCallback((id, user) => {
    setSocket(prevSocket => {
      if (prevSocket) {
        prevSocket.disconnect();
      }
      const socketUrl = `http://${id}.agent.localhost`;
      const newSocket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
        auth: {
          id: user?.id || null,
          name: user?.name || 'Guest',
          image: user?.image || null
        }
      });

      newSocket.on('connect', () => {
        console.log('Terminal socket connected');
      });

      return newSocket;
    });
  }, []);

  // Restore an existing sandbox: either from a ?join=<id> link, or from
  // this browser's own localStorage session.
  useEffect(() => {
    const restore = async () => {
      const params = new URLSearchParams(window.location.search);
      const joinId = params.get('join');

      const targetId = joinId || JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')?.sandboxId;

      if (!targetId) {
        setIsRestoring(false);
        return;
      }

      try {
        const res = await fetch(`http://${targetId}.agent.localhost/list-files`, {
          method: 'GET'
        });

        if (res.ok) {
          const derivedPreviewUrl = `http://${targetId}.preview.localhost`;
          setSandboxId(targetId);
          setPreviewUrl(derivedPreviewUrl);

          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            sandboxId: targetId,
            previewUrl: derivedPreviewUrl
          }));

          // Clean the ?join= param from the URL so refreshing doesn't re-trigger it oddly
          if (joinId) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        } else {
          if (!joinId) localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Sandbox not reachable', err);
        if (!joinId) localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsRestoring(false);
      }
    };

    restore();
  }, []);

  // Connect the socket once we know both the sandbox and the user identity
  useEffect(() => {
    if (sandboxId && currentUser !== null) {
      connectSocket(sandboxId, currentUser);
    } else if (sandboxId && currentUser === null) {
      // Not authenticated — still allow connecting as a guest after a short
      // grace period, in case /me is just slow to resolve.
      const t = setTimeout(() => {
        connectSocket(sandboxId, null);
      }, 800);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandboxId]);

  useEffect(() => {
    if (!sandboxId) {
      setTtl(null);
      return;
    }

    const fetchTTL = async () => {
      try {
        const res = await fetch(`/api/sandbox/ttl/${sandboxId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setTtl(data.ttl);
        } else {
          setTtl(0);
        }
      } catch (err) {
        console.error('Failed to fetch TTL', err);
      }
    };

    fetchTTL();
    const interval = setInterval(fetchTTL, 15000);
    return () => clearInterval(interval);
  }, [sandboxId]);

  const handleSelectFile = useCallback((file) => {
    setSelectedFile(file);
  }, []);

  const handleDragStart = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = topHeight;
    const vh = window.innerHeight;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaPercent = (deltaY / vh) * 100;
      let newHeight = startHeight + deltaPercent;
      if (newHeight < 20) newHeight = 20;
      if (newHeight > 80) newHeight = 80;
      setTopHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const startSandbox = async () => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/sandbox/start', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'default' })
      });
      const data = await res.json();
      if (data.sandboxId) {
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);

        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          sandboxId: data.sandboxId,
          previewUrl: data.previewUrl
        }));
      }
    } catch (err) {
      console.error('Failed to start sandbox:', err);
      alert('Failed to start sandbox. See console for details.');
    } finally {
      setIsStarting(false);
    }
  };

  const copyInviteLink = () => {
    if (!sandboxId) return;
    const url = `${window.location.origin}${window.location.pathname}?join=${sandboxId}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleInvokeAi = async (message, onStream, onDone) => {
    try {
      const res = await fetch('/api/ai/invoke', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: message,
          sandboxId: sandboxId
        })
      });

      if (!res.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let finalMessage = "";
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop();

          for (const evt of events) {
            const line = evt.trim();
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.substring(6);
            try {
              const parsed = JSON.parse(jsonStr);

              if (parsed.type === 'progress') {
                onStream(parsed.message.trim(), 'progress');
              } else if (parsed.type === 'text-chunk') {
                onStream(parsed.message, 'text-chunk');
                finalMessage += parsed.message;
              } else if (parsed.type === 'file-diff') {
                onStream(parsed.diffs, 'file-diff');
              } else if (parsed.type === 'done') {
                finalMessage = parsed.result?.content || finalMessage;
              } else if (parsed.type === 'error') {
                console.error('Agent stream error:', parsed.error);
              }
            } catch {
              // ignore partial/malformed chunks
            }
          }
        }
      }
      onDone(finalMessage);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRefreshPreview = useCallback(() => {
    setPreviewKey(prev => prev + 1);
  }, []);

  if (isRestoring) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#0b0e14] text-on-surface-variant">
        <Loader2 size={24} className="animate-spin text-primary mr-3" />
        <span className="text-sm font-mono">Reconnecting to sandbox...</span>
      </div>
    );
  }

  const ttlLow = ttl !== null && ttl >= 0 && ttl < 300;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0e14] text-on-surface overflow-hidden">
      <header className="h-12 flex items-center justify-between px-4 bg-surface-lowest border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center">
            <Play className="text-primary w-4 h-4 ml-0.5" />
          </div>
          <span className="font-bold tracking-wide">Obsidian IDE</span>
        </div>
        <div className="flex items-center space-x-3">
          {sandboxId && <PresenceBar socket={socket} />}

          {sandboxId && (
            <button
              onClick={copyInviteLink}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-white/5 bg-white/5 hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-colors"
              title="Copy shareable invite link"
            >
              {linkCopied ? <Check size={12} className="text-emerald-400" /> : <LinkIcon size={12} />}
              {linkCopied ? 'Copied' : 'Invite'}
            </button>
          )}

          {sandboxId && ttl !== null && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border ${
                ttlLow
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-white/5 text-on-surface-variant border-white/5'
              }`}
              title="Time remaining before this sandbox is automatically cleaned up"
            >
              <Clock size={12} />
              {formatTTL(ttl)}
            </div>
          )}

          <button
            onClick={startSandbox}
            disabled={isStarting || sandboxId}
            className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isStarting ? 'Starting...' : sandboxId ? 'Running' : 'Start Sandbox'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {!sandboxId ? (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Play className="text-primary ml-1 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-on-surface mb-2">Welcome to Obsidian IDE</h1>
              <p className="text-on-surface-variant max-w-md mx-auto mb-8 text-sm">
                Start a sandbox environment to begin generating full-stack web applications with your AI assistant.
              </p>
              <button
                onClick={startSandbox}
                disabled={isStarting}
                className="bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isStarting ? 'Starting Environment...' : 'Start Sandbox'}
              </button>
            </div>
          </div>
        ) : null}

        <div className="w-64 shrink-0 border-r border-white/5 bg-surface-lowest hidden md:flex flex-col">
          <FileTree sandboxId={sandboxId} onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col relative bg-background">
          <div style={{ height: `${topHeight}%` }} className="shrink-0 flex flex-col min-h-0 bg-[#0b0e14]">
            <WorkspacePane
              sandboxId={sandboxId}
              previewUrl={previewUrl}
              previewKey={previewKey}
              onRefreshPreview={handleRefreshPreview}
              selectedFile={selectedFile}
            />
          </div>

          <div
            className="h-1 w-full cursor-row-resize bg-surface border-y border-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
            onMouseDown={handleDragStart}
          >
          </div>

          <div style={{ height: `${100 - topHeight}%` }} className="flex-1 min-h-0">
            <TerminalPane socket={socket} />
          </div>
        </div>

        <div className="w-80 shrink-0 border-l border-white/5 bg-surface-lowest hidden lg:flex flex-col">
          <Sidebar sandboxId={sandboxId} onInvokeAi={handleInvokeAi} />
        </div>
      </div>
    </div>
  );
}

export default App;