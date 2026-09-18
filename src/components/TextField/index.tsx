import type { ChangeEvent } from 'react';

interface TextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function TextField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder,
  error,
  fullWidth = false,
}: TextFieldProps) {
  const errorId = `${id}-erro`;

  return (
    <div className={fullWidth ? 'flex flex-col gap-1.5 md:col-span-2' : 'flex flex-col gap-1.5'}>
      <label htmlFor={id} className="text-sm font-medium text-(--ink)">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.name, event.target.value)
        }

        onBlur={(event) => onBlur?.(event.target.name)}
        className="w-full rounded-md border border-(--control) bg-(--card) px-3 py-2 text-(--ink) placeholder:text-(--muted) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) aria-invalid:border-red-600"

      />
      {error && (
        <span id={errorId} className="text-sm font-medium text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
