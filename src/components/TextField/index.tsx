import type { ChangeEvent } from 'react';
import Mensagem from '../Mensagem';

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
      <label htmlFor={id} className="campo-rotulo">
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
        className="campo"
      />
      {error && (
        <Mensagem tipo="erro" variante="campo" anunciar={false} id={errorId}>
          {error}
        </Mensagem>
      )}
    </div>
  );
}
