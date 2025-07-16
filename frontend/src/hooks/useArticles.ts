import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesService } from '../services/articlesService';
import type { UserPreference } from '../types/news';
import type { SearchParams } from '../services/articlesService';

// React Query hooks
export const useArticles = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesService.getArticles(params),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => articlesService.getDashboardStats(),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useFeed = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: () => articlesService.getFeed(params),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => articlesService.getCategories(),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useSources = () => {
  return useQuery({
    queryKey: ['sources'],
    queryFn: () => articlesService.getSources(),
    enabled: !!localStorage.getItem('token'),
  });
};

export const useBookmarks = (params: SearchParams = {}) => {
  return useQuery({
    queryKey: ['bookmarks', params],
    queryFn: () => articlesService.getBookmarks(params),
    enabled: !!localStorage.getItem('token'),
  });
};

// Mutation for bookmarking articles
export const useBookmarkArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ articleId, bookmarked }: { articleId: number; bookmarked: boolean }) =>
      articlesService.bookmarkArticle(articleId, bookmarked),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

export const useUserPreferences = () => {
  return useQuery({
    queryKey: ['userPreferences'],
    queryFn: () => articlesService.getUserPreferences(),
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (preferences: Partial<UserPreference>) =>
      articlesService.updateUserPreferences(preferences),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useResetUserPreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => articlesService.resetUserPreferences(),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
