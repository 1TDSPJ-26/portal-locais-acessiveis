import type { ChangeEvent } from 'react';
import Mensagem from '../Mensagem';

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
      <label htmlFor={id} className="campo-rotulo">
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
        className="campo"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      {error && (
        <Mensagem tipo="erro" variante="campo" anunciar={false} id={errorId}>
          {error}
        </Mensagem>
      )}
    </div>
  );
}
