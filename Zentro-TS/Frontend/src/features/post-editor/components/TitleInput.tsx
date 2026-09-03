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
      className="mb-2 w-full border-none bg-transparent py-4 text-4xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground md:text-5xl"
    />
  );
};
