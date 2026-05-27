import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cemeteryApi } from './api';
import type { CemeteryCreateDto, CemeteryUpdateDto } from './types';

export const cemeteryKeys = {
  all: ['cemeteries'] as const,
  list: () => ['cemeteries', 'list'] as const,
  detail: (id: string) => ['cemeteries', id] as const,
};

export const useCemeteries = () =>
  useQuery({ queryKey: cemeteryKeys.list(), queryFn: cemeteryApi.list });

export const useCemetery = (id: string) =>
  useQuery({
    queryKey: cemeteryKeys.detail(id),
    queryFn: () => cemeteryApi.get(id),
    enabled: !!id,
  });

export const useCreateCemetery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CemeteryCreateDto) => cemeteryApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: cemeteryKeys.all }),
  });
};

export const useUpdateCemetery = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CemeteryUpdateDto) => cemeteryApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: cemeteryKeys.all }),
  });
};

export const useDeleteCemetery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cemeteryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: cemeteryKeys.all }),
  });
};

export const usePublishCemetery = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      cemeteryApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: cemeteryKeys.all }),
  });
};
