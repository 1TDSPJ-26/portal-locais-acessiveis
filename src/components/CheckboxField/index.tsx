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
    <div className="campo-checkbox-grupo md:col-span-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.name, event.target.checked)
        }
        className="campo-checkbox"
      />
      <label htmlFor={id} className="campo-checkbox-label">
        {label}
      </label>
    </div>
  );
}
