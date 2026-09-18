import type { ChangeEvent } from 'react';

interface OpcaoSelect {
  valor: string;
  rotulo: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: OpcaoSelect[];
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  placeholder?: string;
  error?: string;
}

export default function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  placeholder,
  error,
}: SelectFieldProps) {
  const errorId = `${id}-erro`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-(--ink)">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onChange(event.target.name, event.target.value)
        }
        onBlur={(event) => onBlur?.(event.target.name)}
        className="w-full rounded-md border border-(--control) bg-(--card) px-3 py-2 text-(--ink) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) aria-invalid:border-red-600"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      {error && (
        <span id={errorId} className="text-sm font-medium text-red-700">
          {error}
        </span>
      )}
    </div>
  );
}
