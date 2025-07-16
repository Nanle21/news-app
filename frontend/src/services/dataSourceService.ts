import { apiClient } from './api';

export interface DataSource {
  id: number;
  name: string;
  type: string;
  base_url: string;
  api_key: string | null;
  config: Record<string, unknown> | null;
  is_active: boolean;
  rate_limit_per_hour: number;
  last_fetched_at: string | null;
  articles_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDataSourceRequest {
  name: string;
  type: string;
  base_url: string;
  api_key?: string;
  config?: Record<string, unknown>;
  is_active?: boolean;
  rate_limit_per_hour?: number;
}

export interface UpdateDataSourceRequest extends Partial<CreateDataSourceRequest> {}

export const dataSourceService = {
  async getDataSources(): Promise<{ data: DataSource[] }> {
    return apiClient.get<{ data: DataSource[] }>('/data-sources');
  },

  async getDataSource(id: number): Promise<{ data_source: DataSource }> {
    return apiClient.get<{ data_source: DataSource }>(`/data-sources/${id}`);
  },

  async createDataSource(data: CreateDataSourceRequest): Promise<{ message: string; data_source: DataSource }> {
    return apiClient.post<{ message: string; data_source: DataSource }>('/data-sources', data);
  },

  async updateDataSource(id: number, data: UpdateDataSourceRequest): Promise<{ message: string; data_source: DataSource }> {
    return apiClient.put<{ message: string; data_source: DataSource }>(`/data-sources/${id}`, data);
  },

  async deleteDataSource(id: number): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/data-sources/${id}`);
  },

  async testDataSource(id: number): Promise<{ message: string; articles_fetched: number; data_source: DataSource }> {
    return apiClient.post<{ message: string; articles_fetched: number; data_source: DataSource }>(`/data-sources/${id}/test`);
  },

  async fetchFromDataSource(id: number): Promise<{ message: string; articles_fetched: number; data_source: DataSource }> {
    return apiClient.post<{ message: string; articles_fetched: number; data_source: DataSource }>(`/data-sources/${id}/fetch`);
  },
}; 