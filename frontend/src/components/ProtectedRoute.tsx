import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from '../layouts/main-layout';
import { useAppSelector } from '../store/hooks';
import { LoadingSpinner } from './index';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-screen" />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content with main layout
  return <MainLayout>{children}</MainLayout>;
}
