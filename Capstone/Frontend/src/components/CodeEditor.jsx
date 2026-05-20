import { useState, useEffect, memo } from 'react';
import { Save, Loader2, Code2 } from 'lucide-react';

const CodeEditor = memo(function CodeEditor({ sandboxId, selectedFile }) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalCode, setOriginalCode] = useState('');

  useEffect(() => {
    if (!sandboxId || !selectedFile) return;

    const fetchFile = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://${sandboxId}.agent.localhost/read-file?files=${selectedFile}`);
        if (res.ok) {
          const json = await res.json();
          // The API returns { "message": "...", "data": [{ "/src/App.jsx": "content" }] }
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

  const handleSave = async () => {
    if (!sandboxId || !selectedFile || code === originalCode) return;
    
    setIsSaving(true);
    try {
      const payload = {
        updates: [
          {
            filePath: selectedFile.replace(/^\//, ''), // remove leading slash for update-file
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
    <div className="flex-1 flex flex-col bg-[#0b0e14]">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono text-on-surface">{selectedFile}</span>
          {isDirty && <div className="w-2 h-2 rounded-full bg-yellow-500"></div>}
        </div>
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Save</span>
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b0e14]/50 backdrop-blur-sm z-10">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : null}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-sm font-mono text-[#e1e2eb] resize-none focus:outline-none whitespace-pre leading-relaxed"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
});

export default CodeEditor;
