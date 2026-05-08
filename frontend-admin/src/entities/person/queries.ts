import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { personApi } from './api';
import type { PersonCreateDto, PersonUpdateDto } from './types';

export const personKeys = {
  all: ['persons'] as const,
  list: (p?: Record<string, unknown>) => ['persons', 'list', p] as const,
  detail: (id: string) => ['persons', id] as const,
};

export const usePersons = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: personKeys.list(params), queryFn: () => personApi.list(params), select: (d) => Array.isArray(d) ? d : (d as { data?: typeof d }).data ?? d });

export const usePerson = (id: string) =>
  useQuery({ queryKey: personKeys.detail(id), queryFn: () => personApi.get(id), enabled: !!id });

export const useCreatePerson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PersonCreateDto) => personApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
};

export const useUpdatePerson = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: PersonUpdateDto) => personApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
};

export const useDeletePerson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => personApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
};

export const usePublishPerson = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      personApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
};
