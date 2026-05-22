import { Navigate } from 'react-router-dom';
import { useAuth } from 'app/providers/auth/AuthContext';
import { Spin } from 'antd';
import type { ReactNode } from 'react';
import { ROUTES } from 'shared/config/routes';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spin fullscreen />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
}
