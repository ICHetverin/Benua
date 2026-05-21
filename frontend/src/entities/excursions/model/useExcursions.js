import { useQuery } from '@tanstack/react-query';
import { fetchExcursions } from '../api/excursionsApi';

export const useExcursions = () =>
  useQuery({
    queryKey: ['excursions'],
    queryFn: fetchExcursions,
  });
