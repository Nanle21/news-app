import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineChevronDown, HiOutlineGlobe } from 'react-icons/hi';
import { Button } from './index';

const languages = [
  { code: 'en', name: 'English', short: 'EN', flag: '🇺🇸' },
  { code: 'fr', name: 'French', short: 'FR', flag: '🇫🇷' },
  { code: 'de', name: 'German', short: 'DE', flag: '🇩🇪' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" onClick={() => setIsOpen(!isOpen)} className="px-2 lg:px-3">
        <HiOutlineGlobe className="mr-1 lg:mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span className="mr-1 text-sm lg:text-base">{currentLang.flag}</span>
        <span className="mr-1 text-sm lg:text-base hidden sm:inline">{currentLang.short}</span>
        <HiOutlineChevronDown
          className={`h-3 w-3 lg:h-4 lg:w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  lang.code === currentLang.code
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3 text-lg">{lang.flag}</span>
                <span className="mr-2 font-medium">{lang.short}</span>
                <span className="text-gray-500 dark:text-gray-400 hidden lg:inline">({lang.name})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
