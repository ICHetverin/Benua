export type Role = 'ADMIN' | 'EDITOR';

export interface AuthUser {
  username: string;
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_at: string; // Jackson SNAKE_CASE: expiresAt → expires_at
  user: AuthUser;
}
