import type { Role } from 'entities/auth/types';

export interface UserDto {
  _id: string;
  username: string;
  roles: Role[];
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateDto {
  username: string;
  password: string;
  roles: Role[];
}

export interface UserUpdateDto {
  password?: string;
  roles?: Role[];
}
