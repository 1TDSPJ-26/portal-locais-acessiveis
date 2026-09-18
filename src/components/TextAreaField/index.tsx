import type { ChangeEvent } from 'react';

interface TextAreaFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  fullWidth?: boolean;
}

export default function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  error,
  fullWidth = false,
}: TextAreaFieldProps) {
  const errorId = `${id}-erro`;

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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(event.target.name, event.target.value)
        }
        onBlur={(event) => onBlur?.(event.target.name)}
        className="w-full resize-none rounded-md border border-(--control) bg-(--card) px-3 py-2 text-(--ink) placeholder:text-(--muted) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) aria-invalid:border-(--alert)"
      />
      {error && (
        <span id={errorId} className="text-sm font-medium text-(--alert)">
          {error}
        </span>
      )}
    </div>
  );
}
