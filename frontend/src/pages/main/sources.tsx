import { useTranslation } from 'react-i18next';
import { HiOutlineGlobe, HiOutlineClock, HiOutlineNewspaper } from 'react-icons/hi';
import { Card, Header, LoadingSpinner, TopBar } from '../../components';
import { useDataSources } from '../../hooks/useDataSources';

export default function Sources() {
  const { t } = useTranslation();
  
  const { data: dataSourcesResponse, isLoading, error } = useDataSources();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('sources.never');
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      }`}>
        {isActive ? t('sources.active') : t('sources.inactive')}
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <TopBar />
        <div className="max-w-7xl mx-auto">
          <Header title={t('navigation.sources')} description={t('sources.pageDescription')} />
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('sources.loadingSources')}</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar />
        <div className="max-w-7xl mx-auto">
          <Header title={t('navigation.sources')} description={t('sources.pageDescription')} />
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{t('sources.failedToLoadSources')}</p>
          </div>
        </div>
      </>
    );
  }

  const dataSources = dataSourcesResponse?.data || [];

  return (
    <>
      <TopBar />
      <div className="max-w-7xl mx-auto">
        <Header 
          title={t('navigation.sources')} 
          description={t('sources.pageDescription')}
        />

        {dataSources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataSources.map((dataSource) => (
              <Card key={dataSource.id} className="overflow-hidden">
                {/* Source Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <HiOutlineGlobe className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {dataSource.name}
                          </h3>
                          {getStatusBadge(dataSource.is_active)}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {dataSource.type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('sources.articlesFetched')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dataSource.articles_count}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('sources.rateLimit')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dataSource.rate_limit_per_hour}{t('sources.perHour')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('sources.lastFetched')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(dataSource.last_fetched_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <HiOutlineClock className="h-4 w-4 mr-2" />
                      <span>{t('sources.automaticallyUpdated')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiOutlineNewspaper className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t('sources.noDataSources')}</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {t('sources.noDataSourcesDescription')}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
