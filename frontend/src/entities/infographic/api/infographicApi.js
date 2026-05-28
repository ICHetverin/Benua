import { useQuery } from '@tanstack/react-query';
import { getInfographics, getInfographicById } from 'shared/api/benuaApi';

export const infographicKeys = {
  all: ['infographics'],
  detail: (id) => ['infographics', id],
};

export const useInfographics = () =>
  useQuery({
    queryKey: infographicKeys.all,
    queryFn: getInfographics,
  });

export const useInfographicById = (id) =>
  useQuery({
    queryKey: infographicKeys.detail(id),
    queryFn: () => getInfographicById(id),
    enabled: !!id,
  });
