import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import authDe from './locales/de/auth.json';
import bookmarksDe from './locales/de/bookmarks.json';
import commonDe from './locales/de/common.json';
import dashboardDe from './locales/de/dashboard.json';
import errorsDe from './locales/de/errors.json';
import navigationDe from './locales/de/navigation.json';
import newsDe from './locales/de/news.json';
import searchDe from './locales/de/search.json';
import settingsDe from './locales/de/settings.json';
import sourcesDe from './locales/de/sources.json';

import authEn from './locales/en/auth.json';
import bookmarksEn from './locales/en/bookmarks.json';
import commonEn from './locales/en/common.json';
import dashboardEn from './locales/en/dashboard.json';
import errorsEn from './locales/en/errors.json';
import navigationEn from './locales/en/navigation.json';
import newsEn from './locales/en/news.json';
import searchEn from './locales/en/search.json';
import settingsEn from './locales/en/settings.json';
import sourcesEn from './locales/en/sources.json';

import authFr from './locales/fr/auth.json';
import bookmarksFr from './locales/fr/bookmarks.json';
import commonFr from './locales/fr/common.json';
import dashboardFr from './locales/fr/dashboard.json';
import errorsFr from './locales/fr/errors.json';
import navigationFr from './locales/fr/navigation.json';
import newsFr from './locales/fr/news.json';
import searchFr from './locales/fr/search.json';
import settingsFr from './locales/fr/settings.json';
import sourcesFr from './locales/fr/sources.json';

// Define types for translation objects
type TranslationObject = Record<string, string | Record<string, string>>;

// Merge translations by language
const mergeTranslations = (
  auth: TranslationObject,
  bookmarks: TranslationObject,
  common: TranslationObject,
  navigation: TranslationObject,
  dashboard: TranslationObject,
  news: TranslationObject,
  errors: TranslationObject,
  search: TranslationObject,
  settings: TranslationObject,
  sources: TranslationObject
) => ({
  auth,
  bookmarks,
  common,
  navigation,
  dashboard,
  news,
  errors,
  search,
  settings,
  sources,
});

const resources = {
  de: {
    translation: mergeTranslations(
      authDe,
      bookmarksDe,
      commonDe,
      navigationDe,
      dashboardDe,
      newsDe,
      errorsDe,
      searchDe,
      settingsDe,
      sourcesDe
    ),
  },
  en: {
    translation: mergeTranslations(
      authEn,
      bookmarksEn,
      commonEn,
      navigationEn,
      dashboardEn,
      newsEn,
      errorsEn,
      searchEn,
      settingsEn,
      sourcesEn
    ),
  },
  fr: {
    translation: mergeTranslations(
      authFr,
      bookmarksFr,
      commonFr,
      navigationFr,
      dashboardFr,
      newsFr,
      errorsFr,
      searchFr,
      settingsFr,
      sourcesFr
    ),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
