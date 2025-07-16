// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiException extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}

// Generic API client
class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, create a generic error
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }

      // Handle validation errors (422) and other errors
      if (response.status === 422 && errorData.errors) {
        throw new ApiException(
          'Validation failed',
          response.status,
          errorData.errors
        );
      }

      // Handle authentication errors
      if (response.status === 401) {
        throw new ApiException(
          'Authentication failed. Please log in again.',
          response.status,
          errorData.errors
        );
      }

      // Handle server errors
      if (response.status >= 500) {
        throw new ApiException(
          'Server error. Please try again later.',
          response.status,
          errorData.errors
        );
      }

      // Handle other errors
      throw new ApiException(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.errors
      );
    }
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
