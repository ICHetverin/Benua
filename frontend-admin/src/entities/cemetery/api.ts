import { adminApi } from 'shared/api/adminApi';
import type { CemeteryDto, CemeteryCreateDto, CemeteryUpdateDto } from './types';

export const cemeteryApi = {
  list: (): Promise<CemeteryDto[]> => adminApi.get('/cemeteries'),

  get: (id: string): Promise<CemeteryDto> => adminApi.get(`/cemeteries/${id}`),

  create: (dto: CemeteryCreateDto): Promise<CemeteryDto> => adminApi.post('/cemeteries', dto),

  update: (id: string, dto: CemeteryUpdateDto): Promise<CemeteryDto> =>
    adminApi.patch(`/cemeteries/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/cemeteries/${id}`),

  setPublished: (id: string, value: boolean): Promise<CemeteryDto> =>
    adminApi.patch(`/cemeteries/${id}/publish`, null, { params: { value } }),
};
