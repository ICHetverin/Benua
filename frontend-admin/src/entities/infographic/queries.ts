import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { infographicApi } from './api';
import type { InfographicCreateDto, InfographicUpdateDto } from './types';

const keys = {
  all: ['infographics'] as const,
  list: () => ['infographics', 'list'] as const,
  detail: (id: string) => ['infographics', id] as const,
};

export const useInfographics = () =>
  useQuery({ queryKey: keys.list(), queryFn: infographicApi.list });

export const useInfographic = (id: string) =>
  useQuery({
    queryKey: keys.detail(id),
    queryFn: () => infographicApi.get(id),
    enabled: !!id,
  });

export const useCreateInfographic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: InfographicCreateDto) => infographicApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
};

export const useUpdateInfographic = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: InfographicUpdateDto) => infographicApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
};

export const useDeleteInfographic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => infographicApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
};

export const usePublishInfographic = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      infographicApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
};
