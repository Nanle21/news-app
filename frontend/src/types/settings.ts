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
}

export type ThemeMode = 'light' | 'dark' | 'system';
