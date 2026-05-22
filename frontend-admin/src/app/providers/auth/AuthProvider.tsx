import { useState, useEffect, type ReactNode } from 'react';
import { authApi } from 'features/auth/authApi';
import { getToken, setToken, clearAuth, getStoredUser, setStoredUser } from 'shared/lib/storage';
import { AuthContext } from './AuthContext';
import type { AuthUser } from 'entities/auth/types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(!!getToken() && !getStoredUser());

  useEffect(() => {
    if (getToken() && !getStoredUser()) {
      authApi.me()
        .then((u) => { setUser(u); setStoredUser(u); })
        .catch(() => { clearAuth(); setUser(null); })
        .finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await authApi.login({ username, password });
    setToken(res.token);
    setStoredUser(res.user);
    setUser(res.user);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    window.location.assign('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
