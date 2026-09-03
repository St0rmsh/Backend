import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setEditorState } from '../state/postEditorSlice';
import { Loader2 } from 'lucide-react';

interface PublishPanelProps {
  onPublish: () => void;
  onSaveDraft: () => void;
  onDelete?: () => void;
}

export const PublishPanel: React.FC<PublishPanelProps> = ({ onPublish, onSaveDraft, onDelete }) => {
  const dispatch = useDispatch();
  const editorState = useSelector((state: RootState) => state.postEditor);
  const { category, tags, content, isSaving, isPublished } = editorState;
  
  const [tagInput, setTagInput] = useState('');

  const wordCount = content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        dispatch(setEditorState({ tags: [...tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    dispatch(setEditorState({ tags: tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <div className="sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
      <div className="border-b border-border px-5 py-5">
        <div className="mb-2 h-1 w-10 rounded-full bg-primary" />
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">Publishing</h3>
        <p className="mt-1 text-sm text-muted-foreground">Set the details for your post.</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
      
      {/* Category */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => dispatch(setEditorState({ category: e.target.value }))}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="Technology">Technology</option>
          <option value="Programming">Programming</option>
          <option value="AI">AI</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-card-foreground">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type and press Enter to add..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Stats */}
      <div className="mb-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-zinc-500 dark:text-zinc-400">Word Count</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{wordCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">Reading Time</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">{readingTime} min</span>
        </div>
      </div>

      {/* Actions */}
      </div>

      <div className="space-y-3 border-t border-border bg-card p-5">
        <button
          onClick={onPublish}
          disabled={isSaving}
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex items-center justify-center gap-2"
        >
          {isSaving && isPublished ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          Publish Post
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="w-full rounded-lg border border-border bg-secondary py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-muted flex items-center justify-center gap-2"
        >
          {isSaving && !isPublished ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          Save Draft
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isSaving}
            className="mt-4 w-full rounded-lg py-2 font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};
