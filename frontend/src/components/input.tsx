import type { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  checked?: boolean;
  required?: boolean;
  autoComplete?: string;
  label?: string;
  error?: string;
}

export default function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  checked,
  required = false,
  autoComplete,
  label,
  error,
}: InputProps) {
  return (
    <div className="mb-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={type === 'checkbox' ? undefined : value}
        checked={type === 'checkbox' ? checked : undefined}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`appearance-none block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm ${
          error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
        } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
