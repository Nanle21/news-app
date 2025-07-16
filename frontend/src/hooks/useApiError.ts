import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { showNotification } from '../store/slices/uiSlice';
import { ApiException } from '../services/api';

export function useApiError() {
  const dispatch = useAppDispatch();

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      let message = 'An unexpected error occurred';
      let type: 'error' | 'warning' = 'error';

      if (error instanceof ApiException) {
        message = error.message;
        
        // Handle different error types
        if (error.status === 401) {
          message = 'Your session has expired. Please log in again.';
          // You could trigger logout here
        } else if (error.status === 403) {
          message = 'You do not have permission to perform this action.';
          type = 'warning';
        } else if (error.status === 404) {
          message = 'The requested resource was not found.';
        } else if (error.status >= 500) {
          message = 'Server error. Please try again later.';
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      // Add context if provided
      if (context) {
        message = `${context}: ${message}`;
      }

      dispatch(showNotification({ message, type }));
      return message;
    },
    [dispatch]
  );

  const handleNetworkError = useCallback(
    (error: unknown) => {
      let message = 'Network error. Please check your connection.';
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          message = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }

      dispatch(showNotification({ message, type: 'error' }));
      return message;
    },
    [dispatch]
  );

  const handleValidationError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiException && error.errors) {
        // Return validation errors for form handling
        return error.errors;
      }
      return null;
    },
    []
  );

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
  };
} 