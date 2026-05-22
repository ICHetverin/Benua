import { useQuery } from '@tanstack/react-query';
import { activityApi } from './api';

export const useActivity = (limit = 20) =>
  useQuery({
    queryKey: ['activity', limit],
    queryFn: () => activityApi.list(limit),
    refetchInterval: 30_000,
  });
