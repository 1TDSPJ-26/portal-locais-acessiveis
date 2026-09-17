import type { ChangeEvent } from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  fullWidth?: boolean;
}

export default function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  fullWidth = false,
}: TextFieldProps) {
  return (
    <div className={fullWidth ? 'flex flex-col gap-1.5 md:col-span-2' : 'flex flex-col gap-1.5'}>
      <label htmlFor={id} className="text-sm font-medium text-(--text-h)">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.name, event.target.value)
        }
        className="w-full rounded-md border border-(--border) bg-(--bg) px-3 py-2 text-(--text-h) placeholder:text-(--text) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
      />
    </div>
  );
}