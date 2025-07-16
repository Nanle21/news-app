import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineSearch } from 'react-icons/hi';
import { LanguageSwitcher, ThemeToggle } from './index';

interface TopBarProps {
  children?: ReactNode;
  className?: string;
}

export default function TopBar({ children, className = '' }: TopBarProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`sticky top-0 z-40 flex flex-col lg:flex-row lg:items-center lg:justify-between h-auto lg:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3 lg:py-0 ${className}`}
    >
      {/* Search bar - full width on mobile, constrained on desktop */}
      <div className="flex items-center space-x-4 mb-3 lg:mb-0">
        <div className="relative flex-1 lg:flex-none lg:w-64">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
          <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Actions - stacked on mobile, inline on desktop */}
      <div className="flex items-center justify-between lg:justify-end space-x-4">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        {children && (
          <div className="flex items-center space-x-2 lg:space-x-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
