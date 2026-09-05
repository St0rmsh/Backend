import { FileText } from "lucide-react";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TitleInput({
  value,
  onChange,
}: TitleInputProps) {
  return (
    <div>
      <label
        htmlFor="post-title"
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"
      >
        <FileText size={16} />
        Post Title
      </label>

      <input
        id="post-title"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter a compelling title..."
        className="w-full border-0 bg-transparent text-2xl font-bold text-slate-900 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600 sm:text-3xl"
      />

      <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
        Keep your title clear, specific, and easy to understand.
      </p>
    </div>
  );
}