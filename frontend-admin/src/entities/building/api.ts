import { adminApi } from 'shared/api/adminApi';
import type { BuildingDto, BuildingCreateDto, BuildingUpdateDto } from './types';

export const buildingApi = {
  list: (params?: Record<string, unknown>): Promise<BuildingDto[]> =>
    adminApi.get('/objects', { params: { size: 10000, ...params } }),

  get: (id: string): Promise<BuildingDto> => adminApi.get(`/objects/${id}`),

  create: (dto: BuildingCreateDto): Promise<BuildingDto> => adminApi.post('/objects', dto),

  update: (id: string, dto: BuildingUpdateDto): Promise<BuildingDto> =>
    adminApi.patch(`/objects/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/objects/${id}`),

  setPublished: (id: string, value: boolean): Promise<BuildingDto> =>
    adminApi.patch(`/objects/${id}/publish`, null, { params: { value } }),

  reorder: (ids: string[]): Promise<void> => adminApi.post('/objects/reorder', ids),
};
