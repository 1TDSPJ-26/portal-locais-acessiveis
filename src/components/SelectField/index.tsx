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
  placeholder?: string;
}

export default function SelectField({
  id,
  name,
  label,
  value,
  options,
  onChange,
  placeholder,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-(--text-h)">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onChange(event.target.name, event.target.value)
        }
        className="w-full rounded-md border border-(--border) bg-(--bg) px-3 py-2 text-(--text-h) outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
    </div>
  );
}