import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '../types/settings';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Get theme from localStorage or default to 'system'
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    return savedTheme || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  // Function to get the actual theme (light/dark) based on system preference
  const getSystemTheme = useCallback(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Function to apply theme to document
  const applyTheme = useCallback(
    (themeMode: ThemeMode) => {
      const actualTheme = themeMode === 'system' ? getSystemTheme() : themeMode;
      const isDarkMode = actualTheme === 'dark';

      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      setIsDark(isDarkMode);
    },
    [getSystemTheme]
  );

  // Set theme function that updates state and localStorage
  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    },
    [applyTheme]
  );

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Apply initial theme
    applyTheme(theme);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
