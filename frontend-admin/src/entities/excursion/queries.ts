import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { excursionApi } from './api';
import type { ExcursionCreateDto, ExcursionUpdateDto } from './types';

export const excursionKeys = {
  all: ['excursions'] as const,
  list: (p?: Record<string, unknown>) => ['excursions', 'list', p] as const,
  detail: (id: string) => ['excursions', id] as const,
};

export const useExcursions = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: excursionKeys.list(params),
    queryFn: () => excursionApi.list(params),
    select: (d) => Array.isArray(d) ? d : (d as { data?: typeof d }).data ?? d,
  });

export const useExcursion = (id: string) =>
  useQuery({
    queryKey: excursionKeys.detail(id),
    queryFn: () => excursionApi.get(id),
    enabled: !!id,
  });

export const useCreateExcursion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ExcursionCreateDto) => excursionApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: excursionKeys.all }),
  });
};

export const useUpdateExcursion = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ExcursionUpdateDto) => excursionApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: excursionKeys.all }),
  });
};

export const useDeleteExcursion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => excursionApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: excursionKeys.all }),
  });
};

export const usePublishExcursion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      excursionApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: excursionKeys.all }),
  });
};
