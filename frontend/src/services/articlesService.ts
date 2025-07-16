import type { Article, UserPreference } from '../types/news';
import type { NewsSource, SourceCategory } from '../types/sources';
import { apiClient } from './api';

export interface ArticlesResponse {
  data: Article[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  meta: {
    total_articles_in_database?: number;
    search_performed_on?: string;
    filters_applied?: Record<string, unknown>;
    feed_type?: string;
    user_preferences_applied?: boolean;
  };
}

export interface SearchParams {
  q?: string;
  start_date?: string;
  end_date?: string;
  category_id?: number;
  source_id?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
}

export const articlesService = {
  async getArticles(params: SearchParams = {}): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    }

    return apiClient.get<ArticlesResponse>(`/articles/search?${searchParams.toString()}`);
  },

  async getDashboardStats(): Promise<{ stats: { total_articles: number; total_bookmarks: number; total_sources: number; todays_articles: number } }> {
    return apiClient.get<{ stats: { total_articles: number; total_bookmarks: number; total_sources: number; todays_articles: number } }>('/articles/dashboard-stats');
  },

  async getFeed(params: SearchParams = {}): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    }

    return apiClient.get<ArticlesResponse>(`/articles/feed?${searchParams.toString()}`);
  },

  async getCategories(): Promise<{ data: SourceCategory[] }> {
    return apiClient.get<{ data: SourceCategory[] }>('/articles/categories');
  },

  async getSources(): Promise<{ data: NewsSource[] }> {
    return apiClient.get<{ data: NewsSource[] }>('/articles/sources');
  },

  async bookmarkArticle(articleId: number, _bookmarked: boolean): Promise<void> {
    return apiClient.post<void>(`/articles/${articleId}/bookmark`);
  },

  async getBookmarks(params: SearchParams = {}): Promise<ArticlesResponse> {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    }

    return apiClient.get<ArticlesResponse>(`/bookmarks?${searchParams.toString()}`);
  },

  async getUserPreferences(): Promise<{ preferences: UserPreference }> {
    return apiClient.get<{ preferences: UserPreference }>('/articles/preferences');
  },

  async updateUserPreferences(preferences: Partial<UserPreference>): Promise<{ message: string; preferences: UserPreference }> {
    return apiClient.put<{ message: string; preferences: UserPreference }>('/articles/preferences', preferences);
  },

  async resetUserPreferences(): Promise<{ message: string; preferences: UserPreference }> {
    return apiClient.delete<{ message: string; preferences: UserPreference }>('/articles/preferences');
  }
};
