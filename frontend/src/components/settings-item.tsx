import type { ReactNode } from 'react';

interface SettingsItemProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function SettingsItem({
  title,
  description,
  children,
  className = '',
}: SettingsItemProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}
