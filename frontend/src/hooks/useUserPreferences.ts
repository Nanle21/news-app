import { useUserPreferences as useUserPreferencesQuery } from './useArticles';
import type { UserPreference } from '../types/news';

export const useUserPreferences = () => {
  const { data, isLoading, error } = useUserPreferencesQuery();
  
  const preferences = data?.preferences;
  
  // Helper functions to get specific preferences with defaults
  const getReadingSpeed = () => preferences?.reading_speed ?? 'normal';
  const getFontSize = () => preferences?.font_size ?? 'medium';
  const getAutoRefreshInterval = () => preferences?.auto_refresh_interval ?? 30;
  const getShowSummaries = () => preferences?.show_summaries ?? true;
  const getDarkModePreferred = () => preferences?.dark_mode_preferred ?? false;
  const getNotificationPreferences = () => preferences?.notification_preferences ?? {};
  
  // Helper to check if user has any custom preferences
  const hasCustomPreferences = () => {
    if (!preferences) return false;
    
    return (
      preferences.reading_speed !== 'normal' ||
      preferences.font_size !== 'medium' ||
      preferences.auto_refresh_interval !== 30 ||
      preferences.show_summaries !== true ||
      preferences.dark_mode_preferred !== false ||
      (preferences.preferred_sources?.length ?? 0) > 0 ||
      (preferences.preferred_categories?.length ?? 0) > 0 ||
      (preferences.preferred_authors?.length ?? 0) > 0 ||
      !preferences.include_all_sources ||
      !preferences.include_all_categories ||
      !preferences.include_all_authors
    );
  };

  return {
    preferences,
    isLoading,
    error,
    // Individual preference getters
    getReadingSpeed,
    getFontSize,
    getAutoRefreshInterval,
    getShowSummaries,
    getDarkModePreferred,
    getNotificationPreferences,
    // Utility functions
    hasCustomPreferences,
  };
}; 