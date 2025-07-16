import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthStatus, ErrorBoundary, LoadingSpinner, ProtectedRoute, RouteLoader } from './components';
import routes from './routes';
import { useAppSelector } from './store/hooks';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

// Component to redirect authenticated users away from auth pages
function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-screen" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Component to initialize auth state on app load
function AuthInitializer() {
  const { user, token, fetchProfile } = useAuth();
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);
  return null;
}

function App() {
  const { t } = useTranslation();

  const renderRoute = (route: (typeof routes)[0]) => {
    const element = route.requiresAuth ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : (
      <AuthRedirect>{route.element}</AuthRedirect>
    );

    return <Route key={route.path} path={route.path} element={element} />;
  };

  return (
    <ErrorBoundary>
      <Router>
        {/* Auth status indicator for testing */}
        {/* <AuthStatus /> */}
        {/* Auth initializer to fetch user profile on load */}
        <AuthInitializer />
        <RouteLoader>
          <Suspense fallback={<LoadingSpinner size="xl" className="h-screen" />}>
            <Routes>
              {routes.map(renderRoute)}
              {/* Remove the old root redirect route */}
              {/* <Route path="/" element={<RootRedirect />} /> */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          {t('errors.pageNotFound')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t('errors.pageNotFoundDescription')}
                        </p>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </RouteLoader>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
