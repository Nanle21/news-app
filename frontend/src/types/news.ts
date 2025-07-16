export interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  image_url: string;
  author: string;
  published_at: string;
  source_id: number;
  category_id: number;
  is_bookmarked: boolean;
  source: {
    id: number;
    name: string;
    url: string;
    description: string;
    is_active: boolean;
  };
  category: {
    id: number;
    name: string;
    description: string;
  };
}

export type SortOption = 'latest' | 'popular';

export interface UserPreference {
  id: number;
  user_id: number;
  preferred_sources: number[] | null;
  preferred_categories: number[] | null;
  preferred_authors: string[] | null;
  include_all_sources: boolean;
  include_all_categories: boolean;
  include_all_authors: boolean;
  reading_speed: 'slow' | 'normal' | 'fast';
  font_size: 'small' | 'medium' | 'large';
  auto_refresh_interval: number;
  show_summaries: boolean;
  dark_mode_preferred: boolean;
  notification_preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
