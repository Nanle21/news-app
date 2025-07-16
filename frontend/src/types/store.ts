// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// UI Types
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  modals: {
    [key: string]: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
}

// Settings Types
export interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    newsUpdates: boolean;
  };
  display: {
    articlesPerPage: number;
    showImages: boolean;
    compactMode: boolean;
  };
  preferences: {
    categories: string[];
    sources: string[];
    sortBy: 'latest' | 'popular';
  };
}

export interface SettingsState {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
}

// Root State
export interface RootState {
  auth: AuthState;
  ui: UIState;
  settings: SettingsState;
}
