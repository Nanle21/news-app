import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteLoaderProps {
  children: React.ReactNode;
}

export default function RouteLoader({ children }: RouteLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only show loader if path actually changed
    if (prevPathRef.current !== location.pathname) {
      setIsLoading(true);
      prevPathRef.current = location.pathname;
      
      // Hide loader after a short delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 