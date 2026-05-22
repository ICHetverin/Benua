import { useQuery } from '@tanstack/react-query';
import { getPublicExcursions, getPublicExcursionById } from 'shared/api/benuaApi';

export const excursionKeys = {
  all: ['public-excursions'],
  detail: (id) => ['public-excursions', id],
};

export const useExcursions = () =>
  useQuery({
    queryKey: excursionKeys.all,
    queryFn: getPublicExcursions,
  });

export const useExcursionById = (id) =>
  useQuery({
    queryKey: excursionKeys.detail(id),
    queryFn: () => getPublicExcursionById(id),
    enabled: !!id,
  });

export const PASSING_METHOD_LABELS = {
  on_foot: 'Пешком',
  by_bike: 'На велосипеде',
  by_bus: 'На автобусе',
  by_car: 'На автомобиле',
};
