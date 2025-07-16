import { useState } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import FormInput from './form-Input';

interface TextInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  className?: string;
}

export default function TextInput({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  disabled = false,
  error,
  register,
  className = '',
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <FormInput
      id={id}
      label={label}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      error={error}
    >
      <div className="relative">
        <input
          id={id}
          type={inputType}
          autoComplete={autoComplete}
          {...register}
          className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 sm:text-sm ${error ? 'border-red-500' : ''} ${className} ${isPassword ? 'pr-10' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={disabled}
          >
            {showPassword ? (
              <HiOutlineEyeOff className="h-5 w-5" />
            ) : (
              <HiOutlineEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </FormInput>
  );
}
