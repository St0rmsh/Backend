import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { TerminalSquare, Circle } from 'lucide-react';

export default function TerminalPane({ socket }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || !socket) return;

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#00000000',
        foreground: '#e1e2eb',
        cursor: '#3b82f6',
        cursorAccent: '#0b0e14',
        selectionBackground: '#3b82f640',
        black: '#0b0e14',
        red: '#ffb4ab',
        green: '#4edea3',
        yellow: '#ffb786',
        blue: '#3b82f6',
        magenta: '#df7412',
        cyan: '#00a572',
        white: '#e1e2eb',
        brightBlack: '#5a5f70',
        brightRed: '#ffb4ab',
        brightGreen: '#4edea3',
        brightYellow: '#ffb786',
        brightBlue: '#60a5fa',
        brightMagenta: '#df7412',
        brightCyan: '#00a572',
        brightWhite: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.5,
      cursorBlink: true,
      cursorStyle: 'bar',
      allowTransparency: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    // Socket.io integration
    term.onData((data) => {
      socket.emit('terminal-input', data);
    });

    const onOutput = (data) => {
      term.write(data);
    };

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('terminal-output', onOutput);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setIsConnected(socket.connected);

    return () => {
      resizeObserver.disconnect();
      socket.off('terminal-output', onOutput);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      term.dispose();
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0b0e14] rounded-b-xl overflow-hidden border-t border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-0 bg-gradient-to-b from-surface-lowest to-[#0b0e14]">
        <div className="flex items-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-t-lg border-t border-l border-r border-white/5 text-on-surface">
            <TerminalSquare size={13} className="text-primary" />
            <span className="text-xs font-mono font-medium tracking-wide">Terminal</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pr-1 pb-2">
          <Circle
            size={7}
            className={`transition-colors ${
              isConnected ? 'text-emerald-400 fill-emerald-400' : 'text-red-400 fill-red-400'
            }`}
          />
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
            {isConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="flex-1 min-h-0 relative bg-[#0b0e14]">
        <div className="absolute inset-0 p-4" ref={terminalRef} />
      </div>
    </div>
  );
}