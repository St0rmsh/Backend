import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus } from 'lucide-react';
import { uploadService } from '../services/upload.service';

interface CoverUploaderProps {
  coverImage?: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const CoverUploader: React.FC<CoverUploaderProps> = ({ coverImage, onUpload, onRemove }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    const validationError = uploadService.validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    onUpload(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
  });

  if (coverImage) {
    return (
      <div className="relative mb-8 group h-62.5 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 md:h-100">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <div {...getRootProps()} className="cursor-pointer bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <input {...getInputProps()} />
            Change Cover
          </div>
          <button onClick={onRemove} className="bg-red-500 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-red-600 transition-colors">
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'}`}
      >
        <input {...getInputProps()} />
        <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-full mb-4">
          <ImagePlus className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">
          {isDragActive ? 'Drop image here...' : 'Add a cover image'}
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center">
          Drag and drop, or click to browse. <br />
          Supports JPEG, PNG, WEBP. Max 5MB.
        </p>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
