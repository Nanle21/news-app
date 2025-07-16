import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header, LoadingSpinner, NewsCard, NewsFilters, Pagination, TopBar } from '../../components';
import { useBookmarkArticle, useBookmarks, useCategories, useSources } from '../../hooks/useArticles';
import { useAppDispatch } from '../../store/hooks';
import { showNotification } from '../../store/slices/uiSlice';
import type { SortOption, Article } from '../../types/news';

// Custom hook for filter state management
function useFilterState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const hasActiveFilters = Boolean(searchTerm || selectedCategory !== 'all' || selectedSource !== 'all' || startDate || endDate);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSource('all');
    setStartDate('');
    setEndDate('');
    setSortBy('latest');
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    hasActiveFilters,
    clearFilters,
  };
}

// Component for bookmarks grid
function BookmarksGrid({ 
  articles, 
  onToggleBookmark, 
  hasActiveFilters 
}: {
  articles: Article[];
  onToggleBookmark: (articleId: number) => void;
  hasActiveFilters: boolean;
}) {
  const { t } = useTranslation();
  
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {hasActiveFilters 
            ? t('bookmarks:noBookmarksWithFilters')
            : t('bookmarks:noBookmarks')
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}

export default function Bookmarks() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  // Filter state management
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedSource,
    setSelectedSource,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    hasActiveFilters,
    clearFilters,
  } = useFilterState();

  // Fetch categories and sources from API
  const { data: categoriesData } = useCategories();
  const { data: sourcesData } = useSources();

  // React Query for bookmarked articles
  const {
    data: articlesData,
    isLoading,
    error,
  } = useBookmarks({
    q: searchTerm || undefined,
    category_id: selectedCategory !== 'all' ? Number.parseInt(selectedCategory, 10) : undefined,
    source_id: selectedSource !== 'all' ? Number.parseInt(selectedSource, 10) : undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    sort_by: sortBy === 'latest' ? 'published_at' : 'title',
    sort_order: 'desc',
    per_page: 12,
    page: currentPage,
  });

  const bookmarkMutation = useBookmarkArticle();

  const handleToggleBookmark = async (articleId: number) => {
    try {
      await bookmarkMutation.mutateAsync({ articleId, bookmarked: false });
      dispatch(
        showNotification({
          message: t('bookmarks:bookmarkRemoved'),
          type: 'success',
        })
      );
    } catch (_error) {
      dispatch(
        showNotification({
          message: t('bookmarks:failedToRemoveBookmark'),
          type: 'error',
        })
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const articles = articlesData?.data || [];
  const categories = categoriesData?.data || [];
  const sources = sourcesData?.data || [];

  // Handle errors
  if (error) {
    dispatch(
      showNotification({
        message: t('bookmarks:failedToLoadBookmarks'),
        type: 'error',
      })
    );
  }

  return (
    <>
      <TopBar />

      <div className="max-w-7xl mx-auto">
        <Header title={t('navigation.bookmarks')} description="Your saved articles" />

        {/* Filters and Search */}
        <NewsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedSource={selectedSource}
          onSourceChange={setSelectedSource}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={categories}
          sources={sources}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && articles.length > 0 && (
          <>
            {/* Results Summary */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {articles.length} of {articlesData?.total || 0} bookmarked articles
                {hasActiveFilters && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (filtered results)
                  </span>
                )}
              </p>
            </div>

            <BookmarksGrid 
              articles={articles}
              onToggleBookmark={handleToggleBookmark}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Pagination */}
            {articlesData && (
              <Pagination
                currentPage={articlesData.current_page}
                totalPages={articlesData.last_page}
                totalItems={articlesData.total}
                perPage={articlesData.per_page}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {hasActiveFilters 
                ? 'No bookmarked articles match your filters.' 
                : 'No bookmarked articles found.'
              }
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
