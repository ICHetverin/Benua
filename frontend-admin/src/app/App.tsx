import './styles/global.css';
import { QueryProvider } from './providers/query/QueryProvider';
import { AntdProvider } from './providers/antd/AntdProvider';
import { AuthProvider } from './providers/auth/AuthProvider';
import { AdminRouter } from './providers/router/AdminRouter';

export function App() {
  return (
    <QueryProvider>
      <AntdProvider>
        <AuthProvider>
          <AdminRouter />
        </AuthProvider>
      </AntdProvider>
    </QueryProvider>
  );
}
