import { useQuery } from '@tanstack/react-query';
import { dataSourceService } from '../services/dataSourceService';

// Basic hook to fetch all data sources (read-only)
export const useDataSources = () => {
  return useQuery({
    queryKey: ['dataSources'],
    queryFn: () => dataSourceService.getDataSources(),
    enabled: !!localStorage.getItem('token'),
  });
}; 