import type { ChangeEvent } from 'react';

interface CheckboxFieldProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (name: string, value: boolean) => void;
}

export default function CheckboxField({
  id,
  name,
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-2.5 py-1 md:col-span-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.name, event.target.checked)
        }
        className="h-4 w-4 shrink-0 accent-(--accent)"
      />
      <label htmlFor={id} className="text-sm text-(--text-h)">
        {label}
      </label>
    </div>
  );
} 