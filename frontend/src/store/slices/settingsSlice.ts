import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { SettingsState, UserSettings } from '../../types/store';

const initialState: SettingsState = {
  settings: {
    language: 'en',
    theme: 'system',
    notifications: {
      email: true,
      push: false,
      newsUpdates: true,
    },
    display: {
      articlesPerPage: 12,
      showImages: true,
      compactMode: false,
    },
    preferences: {
      categories: [],
      sources: [],
      sortBy: 'latest',
    },
  },
  isLoading: false,
  error: null,
  isDirty: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Update settings
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      state.isDirty = true;
    },

    // Update specific setting by path
    updateSetting: (state, action: PayloadAction<{ path: string; value: unknown }>) => {
      const { path, value } = action.payload;
      const keys = path.split('.');
      let current: Record<string, unknown> = state.settings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      state.isDirty = true;
    },

    // Update language
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.settings.language = action.payload;
      state.isDirty = true;
    },

    // Update theme
    updateTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.settings.theme = action.payload;
      state.isDirty = true;
    },

    // Update notification settings
    updateNotificationSettings: (
      state,
      action: PayloadAction<Partial<UserSettings['notifications']>>
    ) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload };
      state.isDirty = true;
    },

    // Update display settings
    updateDisplaySettings: (state, action: PayloadAction<Partial<UserSettings['display']>>) => {
      state.settings.display = { ...state.settings.display, ...action.payload };
      state.isDirty = true;
    },

    // Update preferences
    updatePreferences: (state, action: PayloadAction<Partial<UserSettings['preferences']>>) => {
      state.settings.preferences = { ...state.settings.preferences, ...action.payload };
      state.isDirty = true;
    },

    // Clear dirty state
    clearDirty: (state) => {
      state.isDirty = false;
    },

    // Reset settings to initial state
    resetSettings: (state) => {
      state.settings = initialState.settings;
      state.isDirty = true;
    },
  },
});

export const {
  setLoading,
  setError,
  updateSettings,
  updateSetting,
  updateLanguage,
  updateTheme,
  updateNotificationSettings,
  updateDisplaySettings,
  updatePreferences,
  clearDirty,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
