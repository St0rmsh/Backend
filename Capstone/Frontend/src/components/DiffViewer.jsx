import { useState, useMemo } from 'react';
import { diffLines } from 'diff';
import { ChevronDown, ChevronRight, FileEdit, Plus, Minus } from 'lucide-react';

function DiffFile({ filePath, oldContent, newContent }) {
  const [expanded, setExpanded] = useState(true);

  const { hunks, added, removed } = useMemo(() => {
    const parts = diffLines(oldContent || '', newContent || '');
    let added = 0;
    let removed = 0;
    parts.forEach(part => {
      const lineCount = part.value.split('\n').filter((_, i, arr) => !(i === arr.length - 1 && part.value.endsWith('\n'))).length;
      if (part.added) added += lineCount;
      if (part.removed) removed += lineCount;
    });
    return { hunks: parts, added, removed };
  }, [oldContent, newContent]);

  const isNewFile = !oldContent;

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden bg-[#080a0f] text-xs mb-2">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#0d1117] hover:bg-white/5 transition-colors border-b border-white/5"
      >
        <span className="flex items-center gap-2 min-w-0">
          <FileEdit size={12} className="text-primary shrink-0" />
          <span className="font-mono text-on-surface truncate">{filePath}</span>
          {isNewFile && (
            <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium uppercase tracking-wide">
              new
            </span>
          )}
        </span>
        <span className="flex items-center gap-2 shrink-0 ml-2">
          {added > 0 && (
            <span className="flex items-center gap-0.5 text-emerald-400 font-mono">
              <Plus size={10} />{added}
            </span>
          )}
          {removed > 0 && (
            <span className="flex items-center gap-0.5 text-red-400 font-mono">
              <Minus size={10} />{removed}
            </span>
          )}
          {expanded ? <ChevronDown size={12} className="text-on-surface-variant" /> : <ChevronRight size={12} className="text-on-surface-variant" />}
        </span>
      </button>

      {expanded && (
        <div className="max-h-80 overflow-y-auto font-mono leading-relaxed">
          {hunks.map((part, i) => {
            const lines = part.value.split('\n');
            // Drop the trailing empty string produced by a final newline
            if (lines[lines.length - 1] === '') lines.pop();

            const bgClass = part.added
              ? 'bg-emerald-500/[0.08]'
              : part.removed
              ? 'bg-red-500/[0.08]'
              : '';
            const textClass = part.added
              ? 'text-emerald-300'
              : part.removed
              ? 'text-red-300'
              : 'text-on-surface-variant/70';
            const marker = part.added ? '+' : part.removed ? '-' : ' ';

            return lines.map((line, li) => (
              <div key={`${i}-${li}`} className={`flex ${bgClass} px-3 py-0.5`}>
                <span className={`select-none w-4 shrink-0 ${textClass}`}>{marker}</span>
                <span className={`whitespace-pre-wrap break-all ${textClass}`}>{line}</span>
              </div>
            ));
          })}
        </div>
      )}
    </div>
  );
}

export default function DiffViewer({ diffs }) {
  if (!diffs || diffs.length === 0) return null;

  return (
    <div className="mb-2">
      {diffs.map((d, i) => (
        <DiffFile key={i} filePath={d.filePath} oldContent={d.oldContent} newContent={d.newContent} />
      ))}
    </div>
  );
}