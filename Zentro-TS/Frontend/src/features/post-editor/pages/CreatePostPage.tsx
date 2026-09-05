import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";

import TitleInput from "../components/TitleInput";
import CoverUploader from "../components/CoverUploader";
import MediaUploader from "../components/MediaUploader";
import EditorContent from "../components/EditorContent";
import PublishPanel from "../components/PublishPanel";

import { postEditorService } from "../services/postEditor.service";

export default function CreatePostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please add a title.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please add some content.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("content", content);

      if (category.trim()) {
        formData.append("category", category.trim());
      }

      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      formData.append("isPublished", String(isPublished));

      media.forEach((file) => {
        formData.append("media", file);
      });

      const response = await postEditorService.createPost(formData);

      toast.success(
        isPublished
          ? "Post published successfully."
          : "Draft saved successfully."
      );

      const postId =
        response?.data?.post?._id ||
        response?.post?._id ||
        response?.data?._id ||
        response?._id;

      if (postId) {
        navigate(`/posts/${postId}`);
      } else {
        navigate("/posts");
      }
    } catch (error: any) {
      console.error("Create post error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to create post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/posts"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-slate-600"
              aria-label="Back to posts"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <FileText
                  size={18}
                  className="text-slate-700 dark:text-slate-300"
                />

                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Create Post
                </h1>
              </div>

              <p className="mt-0.5 hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Create and publish a new investigation post
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 sm:inline-flex">
              <Sparkles size={13} />
              Post Editor
            </span>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : isPublished ? (
                <>
                  <CheckCircle2 size={16} />
                  Publish
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Main editor */}
          <section className="min-w-0 space-y-6">
            {/* Title */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <TitleInput value={title} onChange={setTitle} />
            </div>

            {/* Cover */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Cover Image
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add a visual cover for your post.
                </p>
              </div>

              <CoverUploader
                value={coverImage}
                onChange={setCoverImage}
              />
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Content
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Write your investigation, analysis, or report.
                </p>
              </div>

              <EditorContent
                value={content}
                onChange={setContent}
              />
            </div>

            {/* Media */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Attachments
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Add supporting images or videos to your post.
                </p>
              </div>

              <MediaUploader
                value={media}
                onChange={setMedia}
              />
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <PublishPanel
              isPublished={isPublished}
              setIsPublished={setIsPublished}
              tags={tags}
              setTags={setTags}
              onPublish={handleCreate}
              loading={loading}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}