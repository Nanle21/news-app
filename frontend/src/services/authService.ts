import type { User } from '../types/store';
import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('login', credentials);
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Store token in localStorage for future requests
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>('/auth/logout');
    } finally {
      // Always clear the token, even if logout fails
      localStorage.removeItem('token');
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<{user: User}>('/auth/profile');
    return response.user;
  },

  async resendVerificationEmail(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/email/verification-notification');
  },
};
