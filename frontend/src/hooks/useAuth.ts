import { useCallback } from 'react';
import { type LoginCredentials, type RegisterData, authService } from '../services/authService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearError,
  logout,
  setAuth,
  setError,
  setLoading,
  updateUser,
} from '../store/slices/authSlice';
import { ApiException } from '../services/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch(clearError());
      dispatch(setLoading(true));

      try {
        const result = await authService.login(credentials);
        dispatch(setAuth(result));
        return result;
      } catch (error) {
        let message = 'Login failed';
        
        if (error instanceof ApiException) {
          if (error.status === 401) {
            message = 'Invalid email or password';
          } else if (error.status === 422 && error.errors) {
            // Validation errors will be handled by form error handler
            message = 'Please check your input and try again';
          } else {
            message = error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }
        
        dispatch(setError(message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData: RegisterData) => {
      dispatch(clearError());
      dispatch(setLoading(true));

      try {
        const result = await authService.register(userData);
        dispatch(setAuth(result));
        return result;
      } catch (error) {
        let message = 'Registration failed';
        
        if (error instanceof ApiException) {
          if (error.status === 422 && error.errors) {
            // Validation errors will be handled by form error handler
            message = 'Please check your input and try again';
          } else {
            message = error.message;
          }
        } else if (error instanceof Error) {
          message = error.message;
        }
        
        dispatch(setError(message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const logoutUser = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout fails, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  }, [dispatch]);

  const handleAuthError = useCallback((error: unknown) => {
    let message = 'Failed to fetch profile';
    
    if (error instanceof ApiException) {
      if (error.status === 401) {
        message = 'Your session has expired. Please log in again.';
        dispatch(logout());
        return;
      }
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    dispatch(setError(message));
    throw error;
  }, [dispatch]);

  const fetchProfile = useCallback(async () => {
    if (!auth.token) return;

    dispatch(setLoading(true));
    try {
      const user = await authService.getProfile();
      dispatch(updateUser(user));
      return user;
    } catch (error: unknown) {
      handleAuthError(error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, auth.token, handleAuthError]);

  const resendVerificationEmail = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const result = await authService.resendVerificationEmail();
      dispatch(setLoading(false));
      return result;
    } catch (error) {
      let message = 'Failed to resend verification email';
      
      if (error instanceof ApiException) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      dispatch(setError(message));
      throw error;
    }
  }, [dispatch]);

  return {
    ...auth,
    login,
    register,
    logout: logoutUser,
    fetchProfile,
    resendVerificationEmail,
    clearError: () => dispatch(clearError()),
  };
};
