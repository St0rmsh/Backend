import { memo } from 'react';
import { Globe, RefreshCw } from 'lucide-react';

const PreviewPane = memo(function PreviewPane({ previewUrl, previewKey, onRefresh }) {
  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Mock Browser Header */}
      <div className="flex items-center px-4 py-2 bg-surface-lowest border-b border-white/5 space-x-2">
        
        <div className="flex-1 flex items-center bg-surface px-3 py-1 rounded-md border border-white/5">
          <Globe size={14} className="text-on-surface-variant mr-2" />
          <span className="text-xs text-on-surface-variant font-mono truncate">
            {previewUrl || 'about:blank'}
          </span>
        </div>
        
        <button 
          onClick={onRefresh}
          className="p-1 hover:bg-surface rounded-md text-on-surface-variant hover:text-primary transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      {/* Iframe Container */}
      <div className="flex-1 bg-white relative">
        {!previewUrl ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-lowest text-on-surface-variant text-sm font-mono">
            No Sandbox Active
          </div>
        ) : (
          <iframe
            key={previewKey}
            src={previewUrl}
            className="w-full h-full border-none bg-white"
            title="Preview"
            sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          />
        )}
      </div>
    </div>
  );
});

export default PreviewPane;
