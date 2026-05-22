import type { Role } from 'entities/auth/types';

export const hasRole = (userRoles: Role[], required: Role[]): boolean =>
  required.some((r) => userRoles.includes(r));
