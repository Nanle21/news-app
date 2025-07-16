import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store/hooks';
import { showNotification } from '../../store/slices/uiSlice';
import { useUserPreferences, useUpdateUserPreferences, useResetUserPreferences, useCategories, useSources } from '../../hooks/useArticles';
import { Button, Card, Header, LoadingSpinner, SettingsSection, SettingsItem } from '../../components';
import type { UserPreference } from '../../types/news';

// Component for news preferences section
function NewsPreferencesSection({ 
  localPreferences, 
  preferences, 
  onPreferenceChange 
}: {
  localPreferences: Partial<UserPreference>;
  preferences?: UserPreference;
  onPreferenceChange: (field: keyof UserPreference, value: unknown) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <SettingsSection 
      title={t('settings.newsPreferences')} 
      description={t('settings.newsPreferencesDescription')}
    >
      <SettingsItem 
        title={t('settings.includeAllSources')}
        description={t('settings.includeAllSourcesDescription')}
      >
        <input
          type="checkbox"
          checked={localPreferences.include_all_sources ?? preferences?.include_all_sources ?? true}
          onChange={(e) => onPreferenceChange('include_all_sources', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingsItem>

      <SettingsItem 
        title={t('settings.includeAllCategories')}
        description={t('settings.includeAllCategoriesDescription')}
      >
        <input
          type="checkbox"
          checked={localPreferences.include_all_categories ?? preferences?.include_all_categories ?? true}
          onChange={(e) => onPreferenceChange('include_all_categories', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingsItem>

      <SettingsItem 
        title={t('settings.includeAllAuthors')}
        description={t('settings.includeAllAuthorsDescription')}
      >
        <input
          type="checkbox"
          checked={localPreferences.include_all_authors ?? preferences?.include_all_authors ?? true}
          onChange={(e) => onPreferenceChange('include_all_authors', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingsItem>
    </SettingsSection>
  );
}

// Component for reading preferences section
function ReadingPreferencesSection({ 
  localPreferences, 
  preferences, 
  onPreferenceChange 
}: {
  localPreferences: Partial<UserPreference>;
  preferences?: UserPreference;
  onPreferenceChange: (field: keyof UserPreference, value: unknown) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <SettingsSection 
      title={t('settings.readingPreferences')} 
      description={t('settings.readingPreferencesDescription')}
    >
      <SettingsItem 
        title={t('settings.readingSpeed')}
        description={t('settings.readingSpeedDescription')}
      >
        <select
          value={localPreferences.reading_speed ?? preferences?.reading_speed ?? 'normal'}
          onChange={(e) => onPreferenceChange('reading_speed', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="slow">{t('settings:slow')}</option>
          <option value="normal">{t('settings:normal')}</option>
          <option value="fast">{t('settings:fast')}</option>
        </select>
      </SettingsItem>

      <SettingsItem 
        title={t('settings.fontSize')}
        description={t('settings.fontSizeDescription')}
      >
        <select
          value={localPreferences.font_size ?? preferences?.font_size ?? 'medium'}
          onChange={(e) => onPreferenceChange('font_size', e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="small">{t('settings:small')}</option>
          <option value="medium">{t('settings:medium')}</option>
          <option value="large">{t('settings:large')}</option>
        </select>
      </SettingsItem>

      <SettingsItem 
        title={t('settings.autoRefreshInterval')}
        description={t('settings.autoRefreshIntervalDescription')}
      >
        <input
          type="number"
          min="1"
          max="1440"
          value={localPreferences.auto_refresh_interval ?? preferences?.auto_refresh_interval ?? 30}
          onChange={(e) => onPreferenceChange('auto_refresh_interval', Number.parseInt(e.target.value, 10))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </SettingsItem>

      <SettingsItem 
        title={t('settings.showSummaries')}
        description={t('settings.showSummariesDescription')}
      >
        <input
          type="checkbox"
          checked={localPreferences.show_summaries ?? preferences?.show_summaries ?? true}
          onChange={(e) => onPreferenceChange('show_summaries', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingsItem>

      <SettingsItem 
        title={t('settings.darkModePreferred')}
        description={t('settings.darkModePreferredDescription')}
      >
        <input
          type="checkbox"
          checked={localPreferences.dark_mode_preferred ?? preferences?.dark_mode_preferred ?? false}
          onChange={(e) => onPreferenceChange('dark_mode_preferred', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </SettingsItem>
    </SettingsSection>
  );
}

export default function Settings() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Queries
  const { data: preferencesData, isLoading: preferencesLoading } = useUserPreferences();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: sourcesData, isLoading: sourcesLoading } = useSources();
  
  // Mutations
  const updatePreferencesMutation = useUpdateUserPreferences();
  const resetPreferencesMutation = useResetUserPreferences();

  // Local state
  const [localPreferences, setLocalPreferences] = useState<Partial<UserPreference>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const preferences = preferencesData?.preferences;

  // Initialize local preferences when data loads
  useEffect(() => {
    if (preferencesData?.preferences) {
      setLocalPreferences(preferencesData.preferences);
    }
  }, [preferencesData?.preferences]);

  // Track changes by comparing local preferences with server preferences
  useEffect(() => {
    if (preferences && Object.keys(localPreferences).length > 0) {
      const hasActualChanges = JSON.stringify(localPreferences) !== JSON.stringify(preferences);
      setHasChanges(hasActualChanges);
    }
  }, [localPreferences, preferences]);

  const categories = categoriesData?.data || [];
  const sources = sourcesData?.data || [];

  const handlePreferenceChange = (field: keyof UserPreference, value: unknown) => {
    setLocalPreferences(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePreferences = async () => {
    try {
      const result = await updatePreferencesMutation.mutateAsync(localPreferences);
      // Update local preferences with server response to ensure consistency
      setLocalPreferences(result.preferences);
      setHasChanges(false);
      dispatch(
        showNotification({
          message: t('settings.preferencesSaved'),
          type: 'success',
        })
      );
    } catch (_error) {
      dispatch(
        showNotification({
          message: t('settings.preferencesSaveError'),
          type: 'error',
        })
      );
    }
  };

  const handleResetPreferences = async () => {
    try {
      await resetPreferencesMutation.mutateAsync();
      dispatch(
        showNotification({
          message: t('settings.preferencesReset'),
          type: 'success',
        })
      );
    } catch (_error) {
      dispatch(
        showNotification({
          message: t('settings.preferencesResetError'),
          type: 'error',
        })
      );
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    const currentCategories = (localPreferences.preferred_categories || preferences?.preferred_categories) || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    setLocalPreferences((prev) => ({
      ...prev,
      preferred_categories: newCategories,
    }));
  };

  const handleSourceToggle = (sourceId: number) => {
    const currentSources = (localPreferences.preferred_sources || preferences?.preferred_sources) || [];
    const newSources = currentSources.includes(sourceId)
      ? currentSources.filter((id) => id !== sourceId)
      : [...currentSources, sourceId];

    setLocalPreferences((prev) => ({
      ...prev,
      preferred_sources: newSources,
    }));
  };

  if (preferencesLoading || categoriesLoading || sourcesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6">
      <Header 
        title={t('settings.title')} 
        description={t('settings.description')} 
      />

      <div className="space-y-6">
        {/* News Preferences */}
        <NewsPreferencesSection 
          localPreferences={localPreferences}
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
        />

        {/* Preferred Categories */}
        {!localPreferences.include_all_categories && !preferences?.include_all_categories && (
          <SettingsSection 
            title={t('settings.preferredCategories')} 
            description={t('settings.preferredCategoriesDescription')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={((localPreferences.preferred_categories || preferences?.preferred_categories) || []).includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                </label>
              ))}
            </div>
          </SettingsSection>
        )}

        {/* Preferred Sources */}
        {!localPreferences.include_all_sources && !preferences?.include_all_sources && (
          <SettingsSection 
            title={t('settings.preferredSources')} 
            description={t('settings.preferredSourcesDescription')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sources.map((source) => (
                <label key={source.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={((localPreferences.preferred_sources || preferences?.preferred_sources) || []).includes(source.id)}
                    onChange={() => handleSourceToggle(source.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                </label>
              ))}
            </div>
          </SettingsSection>
        )}

        {/* Reading Preferences */}
        <ReadingPreferencesSection 
          localPreferences={localPreferences}
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
        />

        {/* Actions */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={handleSavePreferences}
                loading={updatePreferencesMutation.isPending}
                disabled={!hasChanges || updatePreferencesMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updatePreferencesMutation.isPending ? t('settings.saving') : t('settings.savePreferences')}
              </Button>
              
              <Button
                onClick={handleResetPreferences}
                variant="secondary"
                loading={resetPreferencesMutation.isPending}
                disabled={resetPreferencesMutation.isPending}
                className="w-full sm:w-auto"
              >
                {resetPreferencesMutation.isPending ? t('settings.resetting') : t('settings.resetPreferences')}
              </Button>
            </div>
            
            {hasChanges && !updatePreferencesMutation.isPending && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t('settings.unsavedChanges')}
              </span>
            )}
            
            {updatePreferencesMutation.isPending && (
              <span className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
                <svg className="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t('settings.saving')}
              </span>
            )}
            
            {updatePreferencesMutation.isSuccess && !hasChanges && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('settings.saved')}
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
