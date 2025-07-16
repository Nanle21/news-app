import type { UserSettings } from '../types/store';
import { apiClient } from './api';

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    return apiClient.get<UserSettings>('/articles/preferences');
  },

  async saveSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    return apiClient.put<UserSettings>('/articles/preferences', settings);
  },
};
