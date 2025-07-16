import type { ReactNode } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: FieldError;
  children?: ReactNode;
}

export default function FormInput({ id, label, error, children }: FormInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
    </div>
  );
}
