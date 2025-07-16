import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './index';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      // If system, toggle to the opposite of current system preference
      setTheme(isDark ? 'light' : 'dark');
    } else {
      // If manual, toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="px-2 lg:px-3"
    >
      {isDark ? (
        <HiOutlineSun className="h-4 w-4 lg:h-5 lg:w-5" />
      ) : (
        <HiOutlineMoon className="h-4 w-4 lg:h-5 lg:w-5" />
      )}
    </Button>
  );
}
