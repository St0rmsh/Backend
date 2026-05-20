import { useState, useEffect, memo } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FileCode, FileJson, FileText, Loader2 } from 'lucide-react';

const getFileIcon = (filename) => {
  if (filename.endsWith('.jsx') || filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode size={14} className="text-primary" />;
  if (filename.endsWith('.json')) return <FileJson size={14} className="text-yellow-500" />;
  if (filename.endsWith('.md')) return <FileText size={14} className="text-secondary" />;
  return <File size={14} className="text-on-surface-variant" />;
};

const FileTree = memo(function FileTree({ sandboxId, onSelectFile, selectedFile }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState({ root: true }); // simple tracking of folder expansion
  
  useEffect(() => {
    if (!sandboxId) return;
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://${sandboxId}.agent.localhost/list-files`);
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files || []);
        }
      } catch (err) {
        console.error("Failed to fetch files", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [sandboxId]);

  // Build tree from flat paths
  const buildTree = (paths) => {
    const root = {};
    paths.forEach(path => {
      // Remove leading slash if any
      const parts = path.replace(/^\//, '').split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? null : {};
        }
        current = current[part];
      }
    });
    return root;
  };

  const tree = buildTree(files);

  const toggleFolder = (path) => {
    setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (nodes, currentPath = '') => {
    return Object.keys(nodes).sort().map(name => {
      const isFile = nodes[name] === null;
      const path = currentPath ? `${currentPath}/${name}` : name;
      if (isFile) {
        const isSelected = selectedFile === '/' + path;
        return (
          <div 
            key={path} 
            className={`flex items-center space-x-2 px-2 py-1.5 cursor-pointer rounded-md text-sm select-none ml-3 border border-transparent ${
              isSelected 
                ? 'bg-primary/20 text-on-surface border-primary/20' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
            onClick={() => onSelectFile('/' + path)}
          >
            {getFileIcon(name)}
            <span className="truncate">{name}</span>
          </div>
        );
      }

      // Folder
      return (
        <div key={path} className="ml-2 mt-0.5">
          <div 
            className="flex items-center space-x-1.5 px-2 py-1.5 hover:bg-white/5 cursor-pointer rounded-md text-sm text-on-surface font-medium select-none"
            onClick={() => toggleFolder(path)}
          >
            {expanded[path] ? <ChevronDown size={14} className="text-on-surface-variant" /> : <ChevronRight size={14} className="text-on-surface-variant" />}
            <Folder size={14} className="text-primary fill-primary/20" />
            <span className="truncate">{name}</span>
          </div>
          {expanded[path] && (
            <div className="ml-3 border-l border-white/5 pl-1 py-1 flex flex-col space-y-0.5">
              {renderTree(nodes[name], path)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full w-48 border-r border-white/5 bg-surface-lowest overflow-y-auto py-2">
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between items-center">
        <span>Explorer</span>
        {isLoading && <Loader2 size={12} className="animate-spin" />}
      </div>
      <div className="px-2">
        {files.length > 0 ? renderTree(tree) : (
          !isLoading && <div className="text-xs text-on-surface-variant px-2 italic">No files found</div>
        )}
      </div>
    </div>
  );
});

export default FileTree;
