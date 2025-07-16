export interface NewsSource {
  id: number;
  name: string;
  url: string;
  description: string;
  is_active: boolean;
}

export interface SourceCategory {
  id: number;
  name: string;
  description: string;
}

export type SourceStatus = 'active' | 'inactive' | 'pending';
