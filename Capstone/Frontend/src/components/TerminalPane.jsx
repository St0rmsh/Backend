import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { TerminalSquare } from 'lucide-react';

export default function TerminalPane({ socket }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current || !socket) return;

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#000000',
        foreground: '#e1e2eb',
        cursor: '#3b82f6',
        black: '#0b0e14',
        red: '#ffb4ab',
        green: '#4edea3',
        yellow: '#ffb786',
        blue: '#3b82f6',
        magenta: '#df7412',
        cyan: '#00a572',
        white: '#e1e2eb',
      },
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      cursorBlink: true,
      allowTransparency: true,
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

    socket.on('terminal-output', onOutput);

    return () => {
      resizeObserver.disconnect();
      socket.off('terminal-output', onOutput);
      term.dispose();
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0b0e14] rounded-b-xl overflow-hidden border-t border-white/5">
      <div className="flex items-center px-2 bg-surface-lowest pt-2 border-b border-white/5">
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-t-lg border-t border-l border-r border-white/5 border-b-0 text-on-surface">
          <TerminalSquare size={14} className="text-primary" />
          <span className="text-xs font-mono">Terminal</span>
        </div>
      </div>
      <div className="flex-1 p-3 w-full h-full bg-[#000000]" ref={terminalRef}></div>
    </div>
  );
}
