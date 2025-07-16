import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  // Show loading bar during navigation
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      setIsNavigating(true);
      prevPathRef.current = location.pathname;
      
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-row">
      {/* Loading bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-600 animate-pulse" />
      )}
      
      {/* Sidebar: overlay on mobile, static on desktop */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button (hidden on lg) */}
        <div className="lg:hidden flex items-center justify-between h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Open sidebar menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8" role="img" aria-label="News Aggregator Logo" title="News Aggregator">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" className="w-full h-full" role="img" aria-label="News Aggregator Logo">
                <title>News Aggregator</title>
                <circle cx="24" cy="24" r="22" fill="url(#gradient)" stroke="url(#strokeGradient)" strokeWidth="2"/>
                <g transform="translate(12, 8)">
                  <rect x="2" y="0" width="20" height="28" rx="2" fill="white"/>
                  <rect x="4" y="2" width="16" height="2" rx="1" fill="#374151"/>
                  <rect x="4" y="6" width="12" height="1" rx="0.5" fill="#374151"/>
                  <rect x="4" y="9" width="14" height="1" rx="0.5" fill="#374151"/>
                  <rect x="4" y="12" width="10" height="1" rx="0.5" fill="#374151"/>
                </g>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="100%" stopColor="#F8FAFC"/>
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E2E8F0"/>
                    <stop offset="100%" stopColor="#CBD5E1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        {/* Main page content, always centered and full width on desktop */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
