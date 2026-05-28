import { adminApi } from 'shared/api/adminApi';
import type { InfographicDto, InfographicCreateDto, InfographicUpdateDto } from './types';

export const infographicApi = {
  list: (): Promise<InfographicDto[]> =>
    adminApi.get('/infographics', { params: { size: 10000 } }),

  get: (id: string): Promise<InfographicDto> => adminApi.get(`/infographics/${id}`),

  create: (dto: InfographicCreateDto): Promise<InfographicDto> =>
    adminApi.post('/infographics', dto),

  update: (id: string, dto: InfographicUpdateDto): Promise<InfographicDto> =>
    adminApi.patch(`/infographics/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/infographics/${id}`),

  setPublished: (id: string, value: boolean): Promise<InfographicDto> =>
    adminApi.patch(`/infographics/${id}/publish`, null, { params: { value } }),
};
