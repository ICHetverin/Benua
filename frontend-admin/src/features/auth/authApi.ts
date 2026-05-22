import { adminApi } from 'shared/api/adminApi';
import type { LoginRequest, LoginResponse, AuthUser } from 'entities/auth/types';

export const authApi = {
  login: (dto: LoginRequest): Promise<LoginResponse> => adminApi.post('/auth/login', dto),
  me: (): Promise<AuthUser> => adminApi.get('/auth/me'),
};
