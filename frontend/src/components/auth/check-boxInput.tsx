import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import FormInput from './form-Input';

interface CheckboxInputProps {
  id: string;
  label?: string;
  disabled?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  children?: React.ReactNode;
}

export default function CheckboxInput({
  id,
  label,
  disabled = false,
  error,
  register,
  children,
}: CheckboxInputProps) {
  return (
    <FormInput id={id} label={label} disabled={disabled} error={error}>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          {...register}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600"
          disabled={disabled}
        />
        {children && (
          <label htmlFor={id} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            {children}
          </label>
        )}
      </div>
    </FormInput>
  );
}
