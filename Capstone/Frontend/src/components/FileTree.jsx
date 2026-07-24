import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FileCode, FileJson, FileText, Loader2, Plus, Trash2, Edit2, FolderPlus } from 'lucide-react';

const getFileIcon = (filename) => {
  if (filename.endsWith('.jsx') || filename.endsWith('.js') || filename.endsWith('.ts')) return <FileCode size={14} className="text-primary" />;
  if (filename.endsWith('.json')) return <FileJson size={14} className="text-yellow-500" />;
  if (filename.endsWith('.md')) return <FileText size={14} className="text-secondary" />;
  return <File size={14} className="text-on-surface-variant" />;
};

const FileTree = memo(function FileTree({ sandboxId, onSelectFile, selectedFile }) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState({ root: true });
  const [contextMenu, setContextMenu] = useState(null); // { x, y, path, isFile, isRoot }
  const [renamingPath, setRenamingPath] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [creatingIn, setCreatingIn] = useState(null); // { dirPath, type: 'file' | 'folder' }
  const [newItemValue, setNewItemValue] = useState('');
  const suppressBlurRef = useRef(false);

  const fetchFiles = useCallback(async () => {
    if (!sandboxId) return;
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
  }, [sandboxId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Close context menu on any outside click
  useEffect(() => {
    if (!contextMenu) return;
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, [contextMenu]);

  const buildTree = (paths) => {
    const root = {};
    paths.forEach(p => {
      const parts = p.replace(/^\//, '').split('/');
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

  // Only ONE place ever calls setContextMenu — always the innermost element
  // the user actually right-clicked, via stopPropagation preventing bubbling.
  const openContextMenu = (e, path, isFile, isRoot = false) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, path, isFile, isRoot });
  };

  const handleDelete = async (path) => {
    setContextMenu(null);
    try {
      const res = await fetch(`http://${sandboxId}.agent.localhost/delete-file`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: path })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Delete failed:", err.message || res.statusText);
      }
      await fetchFiles();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const startRename = (path) => {
    setContextMenu(null);
    const name = path.split('/').pop();
    setRenamingPath(path);
    setRenameValue(name);
  };

  const submitRename = async (path) => {
    const trimmed = renameValue.trim();
    setRenamingPath(null);
    if (!trimmed) return;

    const parts = path.split('/');
    parts[parts.length - 1] = trimmed;
    const newPath = parts.join('/');

    if (newPath === path) return;

    try {
      const res = await fetch(`http://${sandboxId}.agent.localhost/rename-file`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath: path, newPath })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Rename failed:", err.message || res.statusText);
      }
      await fetchFiles();
    } catch (err) {
      console.error("Failed to rename", err);
    }
  };

  const startCreate = (dirPath, type) => {
    setContextMenu(null);
    if (dirPath) {
      setExpanded(prev => ({ ...prev, [dirPath]: true }));
    }
    setCreatingIn({ dirPath, type });
    setNewItemValue('');
  };

  const submitCreate = async () => {
    const trimmed = newItemValue.trim();
    const pending = creatingIn;
    setCreatingIn(null);

    if (!trimmed || !pending) return;

    const { dirPath, type } = pending;
    const fullPath = dirPath ? `${dirPath}/${trimmed}` : trimmed;

    try {
      if (type === 'file') {
        const res = await fetch(`http://${sandboxId}.agent.localhost/create-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: [{ filePath: fullPath, content: '' }] })
        });
        if (!res.ok) console.error("Create file failed:", res.statusText);
      } else {
        // Folders don't exist independently in a flat file listing —
        // a placeholder file makes the folder show up in list-files
        const res = await fetch(`http://${sandboxId}.agent.localhost/create-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: [{ filePath: `${fullPath}/.gitkeep`, content: '' }] })
        });
        if (!res.ok) console.error("Create folder failed:", res.statusText);
      }
      await fetchFiles();
    } catch (err) {
      console.error("Failed to create", err);
    }
  };

  // Prevents the input's onBlur from firing before a button's onClick
  // (classic React issue: blur fires first, cancelling the click target)
  const handleActionMouseDown = () => {
    suppressBlurRef.current = true;
  };

  const handleInputBlur = (callback) => {
    if (suppressBlurRef.current) {
      suppressBlurRef.current = false;
      return;
    }
    callback();
  };

  const renderTree = (nodes, currentPath = '') => {
    return Object.keys(nodes).sort().map(name => {
      const isFile = nodes[name] === null;
      const path = currentPath ? `${currentPath}/${name}` : name;

      if (isFile) {
        const isSelected = selectedFile === '/' + path;
        const isRenaming = renamingPath === path;

        if (isRenaming) {
          return (
            <div key={path} className="ml-3 px-2 py-1">
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleInputBlur(() => submitRename(path))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename(path);
                  if (e.key === 'Escape') setRenamingPath(null);
                }}
                className="w-full bg-surface border border-primary/50 rounded px-2 py-0.5 text-sm text-on-surface focus:outline-none"
              />
            </div>
          );
        }

        return (
          <div
            key={path}
            className={`flex items-center space-x-2 px-2 py-1.5 cursor-pointer rounded-md text-sm select-none ml-3 border border-transparent group ${
              isSelected
                ? 'bg-primary/20 text-on-surface border-primary/20'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
            onClick={() => onSelectFile('/' + path)}
            onContextMenu={(e) => openContextMenu(e, path, true)}
          >
            {getFileIcon(name)}
            <span className="truncate flex-1">{name}</span>
          </div>
        );
      }

      // Folder
      const isCreatingHere = creatingIn?.dirPath === path;

      return (
        <div key={path} className="ml-2 mt-0.5">
          <div
            className="flex items-center space-x-1.5 px-2 py-1.5 hover:bg-white/5 cursor-pointer rounded-md text-sm text-on-surface font-medium select-none"
            onClick={() => toggleFolder(path)}
            onContextMenu={(e) => openContextMenu(e, path, false)}
          >
            {expanded[path] ? <ChevronDown size={14} className="text-on-surface-variant" /> : <ChevronRight size={14} className="text-on-surface-variant" />}
            <Folder size={14} className="text-primary fill-primary/20" />
            <span className="truncate">{name}</span>
          </div>
          {expanded[path] && (
            <div className="ml-3 border-l border-white/5 pl-1 py-1 flex flex-col space-y-0.5">
              {renderTree(nodes[name], path)}
              {isCreatingHere && (
                <input
                  autoFocus
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  onBlur={() => handleInputBlur(submitCreate)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitCreate();
                    if (e.key === 'Escape') setCreatingIn(null);
                  }}
                  placeholder={creatingIn.type === 'file' ? 'filename.js' : 'folder-name'}
                  className="ml-3 bg-surface border border-primary/50 rounded px-2 py-0.5 text-sm text-on-surface focus:outline-none"
                />
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="h-full w-48 border-r border-white/5 bg-surface-lowest overflow-y-auto py-2 relative"
      onContextMenu={(e) => {
        // Only treat this as a "root" right-click if the click target
        // is the wrapper itself (empty space), not a bubbled row event.
        if (e.target === e.currentTarget) {
          openContextMenu(e, '', false, true);
        }
      }}
    >
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex justify-between items-center">
        <span>Explorer</span>
        <div className="flex items-center gap-1">
          {isLoading && <Loader2 size={12} className="animate-spin" />}
          <button
            onClick={() => startCreate('', 'file')}
            title="New file"
            className="hover:text-primary transition-colors"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => startCreate('', 'folder')}
            title="New folder"
            className="hover:text-primary transition-colors"
          >
            <FolderPlus size={13} />
          </button>
        </div>
      </div>
      <div className="px-2">
        {files.length > 0 ? renderTree(tree) : (
          !isLoading && <div className="text-xs text-on-surface-variant px-2 italic">No files found</div>
        )}
        {creatingIn?.dirPath === '' && (
          <input
            autoFocus
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
            onBlur={() => handleInputBlur(submitCreate)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitCreate();
              if (e.key === 'Escape') setCreatingIn(null);
            }}
            placeholder={creatingIn.type === 'file' ? 'filename.js' : 'folder-name'}
            className="w-full mt-1 bg-surface border border-primary/50 rounded px-2 py-0.5 text-sm text-on-surface focus:outline-none"
          />
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-surface-highest border border-white/10 rounded-md shadow-xl py-1 min-w-[140px] text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {!contextMenu.isFile && (
            <>
              <button
                onClick={() => startCreate(contextMenu.path, 'file')}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-on-surface"
              >
                <Plus size={13} /> New File
              </button>
              <button
                onClick={() => startCreate(contextMenu.path, 'folder')}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-on-surface"
              >
                <FolderPlus size={13} /> New Folder
              </button>
            </>
          )}
          {!contextMenu.isRoot && (
            <>
              <button
                onMouseDown={handleActionMouseDown}
                onClick={() => startRename(contextMenu.path)}
                className="w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center gap-2 text-on-surface"
              >
                <Edit2 size={13} /> Rename
              </button>
              <button
                onMouseDown={handleActionMouseDown}
                onClick={() => handleDelete(contextMenu.path)}
                className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 flex items-center gap-2 text-red-400"
              >
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default FileTree;