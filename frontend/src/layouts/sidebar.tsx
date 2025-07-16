import { useTranslation } from 'react-i18next';
import {
  HiOutlineBookmark,
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineX,
} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../components';

const navLinks = [
  {
    to: '/dashboard',
    labelKey: 'navigation.dashboard',
    icon: <HiOutlineHome className="mr-3 h-5 w-5" />,
  },
  {
    to: '/news',
    labelKey: 'navigation.news',
    icon: <HiOutlineNewspaper className="mr-3 h-5 w-5" />,
  },
  {
    to: '/sources',
    labelKey: 'navigation.sources',
    icon: <HiOutlineCollection className="mr-3 h-5 w-5" />,
  },
  {
    to: '/bookmarks',
    labelKey: 'navigation.bookmarks',
    icon: <HiOutlineBookmark className="mr-3 h-5 w-5" />,
  },
  {
    to: '/settings',
    labelKey: 'navigation.settings',
    icon: <HiOutlineCog className="mr-3 h-5 w-5" />,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={`
      z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
      fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
      lg:static lg:inset-auto lg:translate-x-0 lg:transform-none
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Logo size="md" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('navigation.newsAggregator')}
          </h1>
        </div>
        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close sidebar"
        >
          <HiOutlineX className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-8 px-4 flex-1">
        <div className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                location.pathname === link.to
                  ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              {link.icon}
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
