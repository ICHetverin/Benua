import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingApi } from './api';
import type { BuildingCreateDto, BuildingUpdateDto } from './types';

export const buildingKeys = {
  all: ['buildings'] as const,
  list: (p?: Record<string, unknown>) => ['buildings', 'list', p] as const,
  detail: (id: string) => ['buildings', id] as const,
};

export const useBuildings = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: buildingKeys.list(params),
    queryFn: () => buildingApi.list(params),
  });

export const useBuilding = (id: string) =>
  useQuery({
    queryKey: buildingKeys.detail(id),
    queryFn: () => buildingApi.get(id),
    enabled: !!id,
  });

export const useCreateBuilding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BuildingCreateDto) => buildingApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: buildingKeys.all }),
  });
};

export const useUpdateBuilding = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: BuildingUpdateDto) => buildingApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: buildingKeys.all }),
  });
};

export const useDeleteBuilding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => buildingApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: buildingKeys.all }),
  });
};

export const usePublishBuilding = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      buildingApi.setPublished(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: buildingKeys.all }),
  });
};
