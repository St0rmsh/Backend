import { useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Play } from 'lucide-react';
import Sidebar from './components/Sidebar';
import WorkspacePane from './components/WorkspacePane';
import TerminalPane from './components/TerminalPane';
import FileTree from './components/FileTree';
import './App.css'; // Just in case, empty file

function App() {
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // for forcing refresh
  const [topHeight, setTopHeight] = useState(70); // percentage
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Start Sandbox
  const startSandbox = async () => {
    setIsStarting(true);
    try {
      const res = await fetch('/api/sandbox/start', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.sandboxId) {
        setSandboxId(data.sandboxId);
        setPreviewUrl(data.previewUrl);
        
        // Connect socket
        const socketUrl = `http://${data.sandboxId}.agent.localhost`;
        const newSocket = io(socketUrl, {
          reconnection: true,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'] // adjust if needed
        });
        
        newSocket.on('connect', () => {
          console.log('Terminal socket connected');
        });

        setSocket(newSocket);
      }
    } catch (err) {
      console.error('Failed to start sandbox:', err);
      alert('Failed to start sandbox. See console for details.');
    } finally {
      setIsStarting(false);
    }
  };

  // Handle AI Invocation (SSE)
  const handleInvokeAi = async (message, onStream, onDone) => {
    try {
      const res = await fetch('/api/ai/invoke', {
        method: 'POST',
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

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // Basic manual SSE parsing (for demonstration, a proper library like '@microsoft/fetch-event-source' is better for production)
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim() === '') continue;
            
            // Wait, looking at the user's data for SSE:
            // "{"type":"progress","message":"Reading Files Successfully...\n"}"
            // It seems it just sends JSON objects separated by newlines, or actual SSE format "data: {...}"?
            // The prompt gave examples like `{"type":"progress","message":"..."}` which isn't strict SSE, or it is line-delimited JSON.
            // Let's parse line-delimited JSON for safety.
            try {
              let jsonStr = line.startsWith('data: ') ? line.substring(6) : line;
              if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) continue;
              
              const parsed = JSON.parse(jsonStr);
              
              if (parsed.type === 'progress') {
                // Optional: we can skip raw progress text in chat if it's too noisy, but let's keep it clean
                const cleanProgress = `\n*[${parsed.message.trim()}]*\n`;
                onStream(cleanProgress);
                finalMessage += cleanProgress;
              } else if (Array.isArray(parsed) && parsed[0]?.id?.includes("AIMessageChunk") && parsed[0]?.kwargs?.content) {
                // Handle the AIMessageChunk
                onStream(parsed[0].kwargs.content);
                finalMessage += parsed[0].kwargs.content;
              } else if (parsed.type === 'done') {
                // Done event
                finalMessage += '\n' + (parsed.message || '');
              }
            } catch {
              // Ignore parse errors on partial chunks if any
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

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0e14] text-on-surface overflow-hidden">
      {/* Top Navbar */}
      <header className="h-12 flex items-center justify-between px-4 bg-surface-lowest border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center">
            <Play className="text-primary w-4 h-4 ml-0.5" />
          </div>
          <span className="font-bold tracking-wide">Obsidian IDE</span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={startSandbox}
            disabled={isStarting || sandboxId}
            className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isStarting ? 'Starting...' : sandboxId ? 'Running' : 'Start Sandbox'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
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

        {/* Left Panel: File Explorer */}
        <div className="w-64 shrink-0 border-r border-white/5 bg-surface-lowest hidden md:flex flex-col">
          <FileTree sandboxId={sandboxId} onSelectFile={handleSelectFile} selectedFile={selectedFile} />
        </div>

        {/* Center Panel: Editor/Preview + Terminal */}
        <div className="flex-1 min-w-0 flex flex-col relative bg-background">
          {/* Workspace Pane (Top) */}
          <div style={{ height: `${topHeight}%` }} className="shrink-0 flex flex-col min-h-0 bg-[#0b0e14]">
            <WorkspacePane 
              sandboxId={sandboxId}
              previewUrl={previewUrl} 
              previewKey={previewKey} 
              onRefreshPreview={handleRefreshPreview}
              selectedFile={selectedFile}
            />
          </div>
          
          {/* Horizontal Splitter */}
          <div 
            className="h-1 w-full cursor-row-resize bg-surface border-y border-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors z-10"
            onMouseDown={handleDragStart}
          >
          </div>

          {/* Terminal Pane (Bottom) */}
          <div style={{ height: `${100 - topHeight}%` }} className="flex-1 min-h-0">
            <TerminalPane socket={socket} />
          </div>
        </div>

        {/* Right Panel: AI Assistant */}
        <div className="w-80 shrink-0 border-l border-white/5 bg-surface-lowest hidden lg:flex flex-col">
          <Sidebar sandboxId={sandboxId} onInvokeAi={handleInvokeAi} />
        </div>
      </div>
    </div>
  );
}

export default App;
