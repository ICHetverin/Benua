import { adminApi } from 'shared/api/adminApi';
import type { UserDto, UserCreateDto } from './types';

export const userApi = {
  list: (): Promise<UserDto[]> => adminApi.get('/admin/users'),
  create: (dto: UserCreateDto): Promise<UserDto> => adminApi.post('/admin/users', dto),
  delete: (id: string): Promise<void> => adminApi.delete(`/admin/users/${id}`),
};
