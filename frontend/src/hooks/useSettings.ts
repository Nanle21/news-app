import { useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearDirty, setError, setLoading, updateSettings } from '../store/slices/settingsSlice';
import type { UserSettings } from '../types/store';

export const useSettings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  const fetchSettings = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const userSettings = await settingsService.getSettings();
      dispatch(updateSettings(userSettings));
      return userSettings;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch settings';
      dispatch(setError(message));
      throw error;
    }
  }, [dispatch]);

  const saveSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const savedSettings = await settingsService.saveSettings(newSettings);
        dispatch(updateSettings(savedSettings));
        dispatch(clearDirty());
        return savedSettings;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save settings';
        dispatch(setError(message));
        throw error;
      }
    },
    [dispatch]
  );

  return {
    ...settings,
    fetchSettings,
    saveSettings,
  };
};
