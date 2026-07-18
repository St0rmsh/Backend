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
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col h-full sticky top-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Publishing</h3>
      
      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => dispatch(setEditorState({ category: e.target.value }))}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-zinc-900 dark:text-white"
        >
          <option value="Technology">Technology</option>
          <option value="Programming">Programming</option>
          <option value="AI">AI</option>
          <option value="General">General</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300">
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
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-zinc-900 dark:text-white"
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
      <div className="mt-auto space-y-3">
        <button
          onClick={onPublish}
          disabled={isSaving}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isSaving && isPublished ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          Publish Post
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {isSaving && !isPublished ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          Save Draft
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isSaving}
            className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium py-2 rounded-md transition-colors mt-4"
          >
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};
