// src/components/CodeEditor.jsx
import { useState, useEffect, memo, useMemo } from 'react';
import { Save, Loader2, Code2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

function getLanguageExtension(filename) {
  if (!filename) return [];
  if (/\.(jsx?|tsx?|mjs|cjs)$/.test(filename)) {
    return [javascript({ jsx: true, typescript: /\.tsx?$/.test(filename) })];
  }
  if (/\.css$/.test(filename)) return [css()];
  if (/\.json$/.test(filename)) return [json()];
  if (/\.html?$/.test(filename)) return [html()];
  return [];
}

const CodeEditor = memo(function CodeEditor({ sandboxId, selectedFile }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalCode, setOriginalCode] = useState('');

  const langExtensions = useMemo(() => getLanguageExtension(selectedFile), [selectedFile]);

  useEffect(() => {
    if (!sandboxId || !selectedFile) return;

    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://${sandboxId}.agent.localhost/read-file?files=${selectedFile}`);
        if (res.ok) {
          const json = await res.json();
          const fileData = json.data?.find(d => d[selectedFile]);
          if (fileData) {
            setCode(fileData[selectedFile]);
            setOriginalCode(fileData[selectedFile]);
          } else {
            setCode('');
            setOriginalCode('');
          }
        }
      } catch (err) {
        console.error("Failed to read file", err);
        setCode('// Error loading file');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [sandboxId, selectedFile]);

  // Warn before losing unsaved changes on tab close/refresh
  useEffect(() => {
    const isDirty = code !== originalCode;
    if (!isDirty) return;

    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [code, originalCode]);

  const handleSave = async () => {
    if (!sandboxId || !selectedFile || code === originalCode) return;

    setIsSaving(true);
    try {
      const payload = {
        updates: [
          {
            filePath: selectedFile.replace(/^\//, ''),
            content: code
          }
        ]
      };
      const res = await fetch(`http://${sandboxId}.agent.localhost/update-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOriginalCode(code);
      }
    } catch (err) {
      console.error("Failed to save file", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Cmd/Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, originalCode, sandboxId, selectedFile]);

  if (!selectedFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-surface text-on-surface-variant">
        <Code2 size={48} className="opacity-20 mb-4" />
        <p className="text-sm">Select a file from the explorer to view its code</p>
      </div>
    );
  }

  const isDirty = code !== originalCode;

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] min-h-0">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-white/5 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-on-surface">{selectedFile}</span>
          {isDirty && <div className="w-2 h-2 rounded-full bg-yellow-500" title="Unsaved changes" />}
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Save</span>
          <span className="text-[10px] text-on-surface-variant/60 ml-1 font-mono hidden md:inline">⌘S</span>
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-auto min-h-0">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b0e14]/50 backdrop-blur-sm z-10">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : null}
        <CodeMirror
          value={code}
          height="100%"
          theme={vscodeDark}
          extensions={langExtensions}
          onChange={(value) => setCode(value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            tabSize: 2,
          }}
          style={{ height: '100%', fontSize: '13px' }}
        />
      </div>
    </div>
  );
});

export default CodeEditor;