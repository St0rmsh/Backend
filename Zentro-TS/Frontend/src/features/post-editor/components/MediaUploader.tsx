import {
  FileImage,
  ImagePlus,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useRef } from "react";
import { uploadService } from "../services/upload.service";

interface MediaUploaderProps {
  value: File[];
  onChange: (value: File[]) => void;
}

export default function MediaUploader({
  value,
  onChange,
}: MediaUploaderProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;

    const validFiles: File[] = [];

    for (const file of files) {
      const validation =
        uploadService.validateMedia(file);

      if (validation) {
        alert(
          `${file.name}\n\n${validation}`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onChange([
        ...value,
        ...validFiles,
      ]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeMedia = (
    index: number
  ) => {
    onChange(
      value.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <button
        type="button"
        onClick={() =>
          inputRef.current?.click()
        }
        className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600 dark:hover:bg-slate-900"
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
          <UploadCloud size={21} />
        </div>

        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Add media
        </p>

        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Images or videos up to 50MB each
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFiles}
      />

      {/* Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  {file.type.startsWith(
                    "video/"
                  ) ? (
                    <Video size={18} />
                  ) : (
                    <FileImage size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  removeMedia(index)
                }
                className="ml-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}