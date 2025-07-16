import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function Header({ title, description, children, className = '' }: HeaderProps) {
  return (
    <div className={`mb-6 lg:mb-8 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {description && (
            <p className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:ml-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
