import { useTranslation } from 'react-i18next';
import { Button, Logo } from './index';

interface ApiErrorFallbackProps {
  error?: Error;
  retry?: () => void;
  resetError?: () => void;
  context?: string;
}

export default function ApiErrorFallback({
  error,
  retry,
  resetError,
  context,
}: ApiErrorFallbackProps) {
  const { t } = useTranslation();

  const handleRetry = () => {
    if (retry) {
      retry();
    } else {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (resetError) {
      resetError();
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    
    if (context) {
      return `Failed to ${context}. Please try again.`;
    }
    
    return t('errors.somethingWentWrongDescription');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
              <svg
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                role="img"
                aria-label="Warning icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {context ? `Failed to ${context}` : t('errors.somethingWentWrong')}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {getErrorMessage()}
            </p>

            {error && process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {retry && (
              <Button onClick={handleRetry} className="flex-1">
                {t('errors.tryAgain')}
              </Button>
            )}
            {resetError && (
              <Button onClick={handleGoBack} variant="secondary" className="flex-1">
                Go Back
              </Button>
            )}
            <Button onClick={handleGoHome} variant="secondary" className="flex-1">
              {t('errors.goHome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 