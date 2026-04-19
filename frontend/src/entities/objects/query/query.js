import { useQuery } from '@tanstack/react-query';
import { api } from 'shared/api/api';

export const useObjectsQuery = () => {
  return useQuery({
    queryKey: ['objects'],
    queryFn: api.getObjects,
    staleTime: 1000 * 60 * 5
  });
};