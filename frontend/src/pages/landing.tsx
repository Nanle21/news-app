import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center">
        <div className="flex items-center justify-center mb-6">
          <Logo size="xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-lg">
          Nanle News Aggregator
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          {t('landing.tagline', 'Your personalized gateway to the world’s news. Discover, bookmark, and customize your news experience across sources and languages.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t('landing.ctaLogin', 'Sign In')}
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold text-lg shadow border border-blue-600 hover:bg-blue-50 dark:bg-gray-900 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-800"
          >
            {t('landing.ctaRegister', 'Create Account')}
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('landing.noAccount', 'No account yet? Create one for free!')}
          </span>
        </div>
      </header>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('landing.featuresTitle', 'Why Choose Nanle News Aggregator?')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <svg className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><title>News aggregation</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4" /></svg>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {t('landing.feature1Title', 'All Your News, One Place')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('landing.feature1Desc', 'Aggregate news from top sources and categories, personalized for you.')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <svg className="h-10 w-10 text-green-600 dark:text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><title>Bookmark and customize</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0H8m4 0h4" /></svg>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {t('landing.feature2Title', 'Bookmark & Customize')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('landing.feature2Desc', 'Save articles, set preferences, and tailor your reading experience.')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <svg className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><title>Multilingual and accessible</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zm0 0V4" /></svg>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {t('landing.feature3Title', 'Multilingual & Accessible')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('landing.feature3Desc', 'Read in your language, enjoy dark mode, and listen to articles with text-to-speech.')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Nanle News Aggregator. {t('landing.rights', 'All rights reserved.')}
      </footer>
    </div>
  );
} 