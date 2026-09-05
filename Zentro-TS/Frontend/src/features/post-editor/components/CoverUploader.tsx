import {
  ImagePlus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { uploadService } from "../services/upload.service";

interface CoverUploaderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CoverUploader({
  value,
  onChange,
}: CoverUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validation =
      uploadService.validateImage(file);

    if (validation) {
      alert(validation);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    try {
      setUploading(true);

      const previewUrl =
        URL.createObjectURL(file);

      if (
        value &&
        value.startsWith("blob:")
      ) {
        URL.revokeObjectURL(value);
      }

      onChange(previewUrl);
    } catch (error) {
      console.error(
        "Cover upload error:",
        error
      );

      alert(
        "Failed to prepare cover image."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeCover = () => {
    if (
      value &&
      value.startsWith("blob:")
    ) {
      URL.revokeObjectURL(value);
    }

    onChange("");
  };

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-950">
          <img
            src={value}
            alt="Post cover preview"
            className="aspect-[16/7] w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <span className="text-xs font-medium text-white">
              Cover preview
            </span>

            <button
              type="button"
              onClick={removeCover}
              className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-white"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() =>
            inputRef.current?.click()
          }
          className="group flex min-h-[190px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-900"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm transition group-hover:scale-105 dark:bg-slate-900 dark:text-slate-400">
            {uploading ? (
              <UploadCloud
                size={22}
                className="animate-pulse"
              />
            ) : (
              <ImagePlus size={22} />
            )}
          </div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {uploading
              ? "Preparing image..."
              : "Upload cover image"}
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            PNG, JPG, WEBP up to 5MB
          </p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}