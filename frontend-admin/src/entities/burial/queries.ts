import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { burialApi } from './api';
import type { BurialCreateDto, BurialUpdateDto } from './types';

export const burialKeys = {
  all: ['burials'] as const,
  list: (p?: Record<string, unknown>) => ['burials', 'list', p] as const,
  detail: (id: string) => ['burials', id] as const,
};

export const useBurials = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: burialKeys.list(params),
    queryFn: () => burialApi.list(params),
  });

export const useBurial = (id: string) =>
  useQuery({
    queryKey: burialKeys.detail(id),
    queryFn: () => burialApi.get(id),
    enabled: !!id,
  });

export const useCreateBurial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BurialCreateDto) => burialApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: burialKeys.all }),
  });
};

export const useUpdateBurial = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BurialUpdateDto) => burialApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: burialKeys.all }),
  });
};

export const useDeleteBurial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => burialApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: burialKeys.all }),
  });
};

export const usePublishBurial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      burialApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: burialKeys.all }),
  });
};
