import { useState, memo } from 'react';
import { MonitorPlay, Code2 } from 'lucide-react';
import PreviewPane from './PreviewPane';
import CodeEditor from './CodeEditor';

const WorkspacePane = memo(function WorkspacePane({ sandboxId, previewUrl, previewKey, onRefreshPreview, selectedFile }) {
  const [mode, setMode] = useState('preview'); // 'preview' | 'code'

  return (
    <div className="flex flex-col h-full w-full glass-panel rounded-b-none border-b-0 rounded-t-xl overflow-hidden">
      {/* Workspace Header with Toggle */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface-lowest border-b border-white/5">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-secondary"></div>
        </div>

        {/* Segmented Control */}
        <div className="flex bg-surface p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'preview'
                ? 'bg-primary/20 text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}
          >
            <MonitorPlay size={16} />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setMode('code')}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'code'
                ? 'bg-primary/20 text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}
          >
            <Code2 size={16} />
            <span>Code</span>
          </button>
        </div>

        <div className="w-16"></div> {/* Spacer to center toggle */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={`${mode === 'preview' ? 'flex' : 'hidden'} h-full w-full absolute inset-0`}>
          <PreviewPane
            previewUrl={previewUrl}
            previewKey={previewKey}
            onRefresh={onRefreshPreview}
          />
        </div>
        <div className={`${mode === 'code' ? 'flex' : 'hidden'} h-full w-full absolute inset-0`}>
          <CodeEditor sandboxId={sandboxId} selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
});

export default WorkspacePane;
