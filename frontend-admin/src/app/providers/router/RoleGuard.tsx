import { Result } from 'antd';
import { useAuth } from 'app/providers/auth/AuthContext';
import { hasRole } from 'shared/lib/role';
import type { Role } from 'entities/auth/types';
import type { ReactNode } from 'react';

interface Props {
  roles: Role[];
  children: ReactNode;
}

export function RoleGuard({ roles, children }: Props) {
  const { user } = useAuth();
  if (!user || !hasRole(user.roles, roles)) {
    return <Result status="403" title="403" subTitle="Недостаточно прав" />;
  }
  return <>{children}</>;
}
