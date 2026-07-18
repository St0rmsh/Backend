import React from 'react';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TitleInput: React.FC<TitleInputProps> = ({ value, onChange, placeholder = "Post Title" }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 py-4 mb-2"
    />
  );
};
