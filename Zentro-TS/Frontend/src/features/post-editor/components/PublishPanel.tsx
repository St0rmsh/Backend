import {
  Check,
  Globe2,
  Hash,
  Lock,
  Plus,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

interface PublishPanelProps {
  isPublished: boolean;
  setIsPublished: (
    value: boolean
  ) => void;
  tags: string[];
  setTags: (
    value: string[]
  ) => void;
  onPublish: () => void;
  loading: boolean;
}

export default function PublishPanel({
  isPublished,
  setIsPublished,
  tags,
  setTags,
  onPublish,
  loading,
}: PublishPanelProps) {
  const [tagInput, setTagInput] =
    useState("");

  const addTag = () => {
    const tag = tagInput
      .trim()
      .replace(/^#/, "");

    if (!tag) return;

    if (
      tags.some(
        (existingTag) =>
          existingTag.toLowerCase() ===
          tag.toLowerCase()
      )
    ) {
      setTagInput("");
      return;
    }

    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (
    tag: string
  ) => {
    setTags(
      tags.filter(
        (item) => item !== tag
      )
    );
  };

  const handleTagKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      {/* Publish card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Send
              size={17}
              className="text-slate-700 dark:text-slate-300"
            />

            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Publishing
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Choose how this post should be saved.
          </p>
        </div>

        {/* Draft */}
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setIsPublished(false)
          }
          className={`mb-2 w-full rounded-xl border p-3 text-left transition ${
            !isPublished
              ? "border-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
              : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                !isPublished
                  ? "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-500"
              }`}
            >
              <Lock size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Draft
              </p>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Only you can access it.
              </p>
            </div>

            {!isPublished && (
              <Check
                size={17}
                className="text-slate-700 dark:text-slate-200"
              />
            )}
          </div>
        </button>

        {/* Published */}
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setIsPublished(true)
          }
          className={`w-full rounded-xl border p-3 text-left transition ${
            isPublished
              ? "border-slate-400 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
              : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                isPublished
                  ? "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-950 dark:text-slate-500"
              }`}
            >
              <Globe2 size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Published
              </p>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Make this post visible.
              </p>
            </div>

            {isPublished && (
              <Check
                size={17}
                className="text-slate-700 dark:text-slate-200"
              />
            )}
          </div>
        </button>

        {/* Action */}
        <button
          type="button"
          onClick={onPublish}
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : isPublished ? (
            <>
              <Send size={16} />
              Publish Post
            </>
          ) : (
            <>
              <Check size={16} />
              Save Draft
            </>
          )}
        </button>
      </div>

      {/* Tags */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <Hash
            size={17}
            className="text-slate-700 dark:text-slate-300"
          />

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tags
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help organize your post.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(event) =>
              setTagInput(
                event.target.value
              )
            }
            onKeyDown={
              handleTagKeyDown
            }
            placeholder="Add a tag..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600 dark:focus:border-slate-600 dark:focus:ring-slate-800"
          />

          <button
            type="button"
            onClick={addTag}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            aria-label="Add tag"
          >
            <Plus size={17} />
          </button>
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                #{tag}

                <button
                  type="button"
                  onClick={() =>
                    removeTag(tag)
                  }
                  className="rounded-full text-slate-400 transition hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        )}

        {tags.length === 0 && (
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            No tags added yet.
          </p>
        )}
      </div>
    </div>
  );
}