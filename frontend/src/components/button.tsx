import type { ReactNode } from 'react';
import { HiOutlineRefresh } from 'react-icons/hi';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  title?: string;
}

export default function Button({
  type = 'button',
  children,
  onClick,
  className = '',
  loading = false,
  disabled = false,
  variant = 'primary',
  title,
}: ButtonProps) {
  const baseClasses =
    'group relative flex justify-center items-center py-2 px-3 lg:px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

  const variantClasses = {
    primary:
      'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary:
      'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-blue-500',
    ghost:
      'border-transparent text-gray-600 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:ring-blue-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      title={title}
    >
      {loading && <HiOutlineRefresh className="animate-spin -ml-1 mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5" />}
      {children}
    </button>
  );
}
