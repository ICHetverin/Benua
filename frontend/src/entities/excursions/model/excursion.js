import { useQuery } from '@tanstack/react-query';
import {
  getExcursions,
  getPublicExcursionById,
  getPublicExcursions,
} from 'shared/api/benuaApi';

export const excursionKeys = {
  all: ['public-excursions'],
  detail: (id) => ['public-excursions', id],
};

export const useExcursions = (search = '') =>
  useQuery({
    queryKey: [...excursionKeys.all, search],
    queryFn: () => (search ? getExcursions(search) : getPublicExcursions()),
  });

export const useExcursionById = (id) =>
  useQuery({
    queryKey: excursionKeys.detail(id),
    queryFn: () => getPublicExcursionById(id),
    enabled: !!id,
  });

