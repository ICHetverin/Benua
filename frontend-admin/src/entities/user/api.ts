import { adminApi } from 'shared/api/adminApi';
import type { UserDto, UserCreateDto, UserUpdateDto } from './types';

export const userApi = {
  list: (): Promise<UserDto[]> => adminApi.get('/admin/users'),
  create: (dto: UserCreateDto): Promise<UserDto> => adminApi.post('/admin/users', dto),
  update: (id: string, dto: UserUpdateDto): Promise<UserDto> => adminApi.patch(`/admin/users/${id}`, dto),
  delete: (id: string): Promise<void> => adminApi.delete(`/admin/users/${id}`),
};
