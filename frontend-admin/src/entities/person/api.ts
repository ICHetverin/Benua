import { adminApi } from 'shared/api/adminApi';
import type { PersonDto, PersonCreateDto, PersonUpdateDto } from './types';

export const personApi = {
  list: (params?: Record<string, unknown>): Promise<PersonDto[]> =>
    adminApi.get('/persons', { params: { size: 10000, ...params } }),

  get: (id: string): Promise<PersonDto> => adminApi.get(`/persons/${id}`),

  create: (dto: PersonCreateDto): Promise<PersonDto> => adminApi.post('/persons', dto),

  update: (id: string, dto: PersonUpdateDto): Promise<PersonDto> =>
    adminApi.patch(`/persons/${id}`, dto),

  delete: (id: string): Promise<void> => adminApi.delete(`/persons/${id}`),

  setPublished: (id: string, value: boolean): Promise<PersonDto> =>
    adminApi.patch(`/persons/${id}/publish`, null, { params: { value } }),

  reorder: (ids: string[]): Promise<void> => adminApi.post('/persons/reorder', ids),
};
