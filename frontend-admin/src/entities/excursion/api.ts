import { adminApi } from 'shared/api/adminApi';
import type { ExcursionDto, ExcursionCreateDto, ExcursionUpdateDto } from './types';

export const excursionApi = {
  list: (params?: Record<string, unknown>): Promise<ExcursionDto[]> =>
    adminApi.get('/excursions', { params: { size: 10000, ...params } }),

  get: (id: string): Promise<ExcursionDto> => adminApi.get(`/excursions/${id}`),

  create: (dto: ExcursionCreateDto): Promise<ExcursionDto> => adminApi.post('/excursions', dto),

  update: (id: string, dto: ExcursionUpdateDto): Promise<ExcursionDto> =>
    adminApi.patch(`/excursions/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/excursions/${id}`),

  setPublished: (id: string, value: boolean): Promise<ExcursionDto> =>
    adminApi.patch(`/excursions/${id}/publish`, null, { params: { value } }),

  reorder: (ids: string[]): Promise<void> => adminApi.post('/excursions/reorder', ids),
};
