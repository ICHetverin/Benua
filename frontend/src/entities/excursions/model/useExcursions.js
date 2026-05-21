import { useQuery } from '@tanstack/react-query';
import { fetchExcursions, fetchExcursionById } from '../api/excursionsApi';

export const useExcursions = () =>
  useQuery({
    queryKey: ['excursions'],
    queryFn: fetchExcursions,
  });

export const useExcursionById = (id) =>
  useQuery({
    queryKey: ['excursion', id],
    queryFn: () => fetchExcursionById(id),
    enabled: !!id,
  });
