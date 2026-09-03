import React, { useCallback, useState } from "react";
import { Film, ImagePlus, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadService } from "../services/upload.service";

interface MediaUploaderProps {
  mediaUrl?: string;
  mediaType?: "image" | "video";
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ mediaUrl, mediaType, onUpload, onRemove }) => {
  const [error, setError] = useState<string | null>(null);
  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    const validationError = uploadService.validateMedia(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onUpload(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    maxFiles: 1,
  });

  if (mediaUrl && mediaType) {
    return (
      <div className="relative mb-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-black">
        {mediaType === "video" ? <video src={mediaUrl} controls className="max-h-[420px] w-full object-contain" /> : <img src={mediaUrl} alt="Post media preview" className="max-h-[420px] w-full object-contain" />}
        <button type="button" onClick={onRemove} aria-label="Remove post media" className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div {...getRootProps()} className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700"}`}>
        <input {...getInputProps()} />
        <div className="mb-4 flex gap-2 rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
          <ImagePlus className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          <Film className="h-5 w-5 text-zinc-500" aria-hidden="true" />
        </div>
        <p className="font-medium text-zinc-700 dark:text-zinc-300">{isDragActive ? "Drop media here..." : "Add post media"}</p>
        <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">Images and videos up to 50MB</p>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
