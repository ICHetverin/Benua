import { adminApi } from 'shared/api/adminApi';
import type { BurialDto, BurialCreateDto, BurialUpdateDto } from './types';

export const burialApi = {
  list: (params?: Record<string, unknown>): Promise<BurialDto[]> =>
    adminApi.get('/burials', { params: { size: 10000, ...params } }),

  get: (id: string): Promise<BurialDto> => adminApi.get(`/burials/${id}`),

  create: (dto: BurialCreateDto): Promise<BurialDto> => adminApi.post('/burials', dto),

  update: (id: string, dto: BurialUpdateDto): Promise<BurialDto> =>
    adminApi.patch(`/burials/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/burials/${id}`),

  setPublished: (id: string, value: boolean): Promise<BurialDto> =>
    adminApi.patch(`/burials/${id}/publish`, null, { params: { value } }),
};
