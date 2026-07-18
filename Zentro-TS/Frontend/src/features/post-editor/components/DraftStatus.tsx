import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Cloud, CloudOff, CheckCircle2 } from 'lucide-react';

export const DraftStatus: React.FC = () => {
  const { isSaving, isDirty, lastSavedAt, isPublished } = useSelector((state: RootState) => state.postEditor);

  return (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <span className="flex items-center gap-1 text-zinc-500">
          <Cloud className="w-4 h-4 animate-pulse" /> Saving...
        </span>
      ) : isDirty ? (
        <span className="flex items-center gap-1 text-amber-500">
          <CloudOff className="w-4 h-4" /> Unsaved changes
        </span>
      ) : lastSavedAt ? (
        <span className="flex items-center gap-1 text-green-500 dark:text-green-400">
          <CheckCircle2 className="w-4 h-4" /> {isPublished ? 'Published' : 'Saved'} {new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ) : (
        <span className="text-zinc-400">New Draft</span>
      )}
    </div>
  );
};
