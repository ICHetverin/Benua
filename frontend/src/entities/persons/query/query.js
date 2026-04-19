import { useQuery } from '@tanstack/react-query';
import { api } from 'shared/api/api';

export const usePersonsQuery = () => {
  return useQuery({
    queryKey: ['persons'],
    queryFn: api.getPersons,
    staleTime: 1000 * 60 * 5
  });
};