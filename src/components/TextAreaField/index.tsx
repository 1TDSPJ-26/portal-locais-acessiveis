import type { ChangeEvent } from 'react';

interface TextAreaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
}

export default function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  fullWidth = false,
}: TextAreaFieldProps) {
  return (
    <div className={fullWidth ? 'flex flex-col gap-1.5 md:col-span-2' : 'flex flex-col gap-1.5'}>
      <label htmlFor={id} className="text-sm font-medium text-(--ink)">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(event.target.name, event.target.value)
        }
        className="w-full resize-none rounded-md border border-(--control) bg-(--card) px-3 py-2 text-(--ink) placeholder:text-(--muted)"
      />
    </div>
  );
}