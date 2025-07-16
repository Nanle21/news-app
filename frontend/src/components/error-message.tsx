import type { ReactNode } from 'react';

interface ErrorMessageProps {
  children: ReactNode;
  className?: string;
}

export default function ErrorMessage({ children, className = '' }: ErrorMessageProps) {
  return <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${className}`}>{children}</p>;
}
