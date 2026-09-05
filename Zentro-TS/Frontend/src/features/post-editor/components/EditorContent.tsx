import {
  Bold,
  Code2,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

interface EditorContentProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EditorContent({
  value,
  onChange,
}: EditorContentProps) {
  const insertMarkdown = (
    prefix: string,
    suffix = ""
  ) => {
    const textarea = document.getElementById(
      "post-content"
    ) as HTMLTextAreaElement | null;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = value.slice(start, end);

    const replacement =
      prefix + selectedText + suffix;

    const newValue =
      value.slice(0, start) +
      replacement +
      value.slice(end);

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursorPosition =
        start +
        prefix.length +
        selectedText.length +
        suffix.length;

      textarea.setSelectionRange(
        cursorPosition,
        cursorPosition
      );
    });
  };

  const toolbar = [
    {
      label: "Bold",
      icon: Bold,
      action: () =>
        insertMarkdown("**", "**"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () =>
        insertMarkdown("*", "*"),
    },
    {
      label: "Heading",
      icon: Heading2,
      action: () =>
        insertMarkdown("## "),
    },
    {
      label: "Quote",
      icon: Quote,
      action: () =>
        insertMarkdown("> "),
    },
    {
      label: "Bullet list",
      icon: List,
      action: () =>
        insertMarkdown("- "),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      action: () =>
        insertMarkdown("1. "),
    },
    {
      label: "Code",
      icon: Code2,
      action: () =>
        insertMarkdown("`", "`"),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-700 dark:bg-slate-950">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
        {toolbar.map(
          ({
            label,
            icon: Icon,
            action,
          }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              title={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Icon size={16} />
            </button>
          )
        )}
      </div>

      {/* Editor */}
      <textarea
        id="post-content"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Start writing your post..."
        className="min-h-[420px] w-full resize-y border-0 bg-white p-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-600 sm:p-6"
      />

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500">
        Markdown formatting is supported.
      </div>
    </div>
  );
}