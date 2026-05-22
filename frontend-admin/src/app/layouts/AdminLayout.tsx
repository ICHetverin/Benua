import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space, Avatar } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  BankOutlined,
  CompassOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from 'app/providers/auth/AuthContext';
import { ROUTES } from 'shared/config/routes';

const { Sider, Header, Content } = Layout;

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdmin = user?.roles.includes('ADMIN');

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Дашборд' },
    ...(isAdmin
      ? [{ key: '/persons', icon: <UserOutlined />, label: 'Персоны' }]
      : []),
    { key: '/buildings', icon: <BankOutlined />, label: 'Объекты' },
    ...(isAdmin
      ? [{ key: '/excursions', icon: <CompassOutlined />, label: 'Экскурсии' }]
      : []),
    ...(isAdmin
      ? [{ key: '/users', icon: <TeamOutlined />, label: 'Пользователи' }]
      : []),
  ];

  const selectedKey = menuItems.find((i) => i.key !== '/' && pathname.startsWith(i.key))?.key ?? '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth={0}>
        <div style={{ padding: '16px', color: '#fff', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>
          Benua Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Typography.Text strong>{user?.username}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {user?.roles.join(', ')}
            </Typography.Text>
            <Button icon={<LogoutOutlined />} onClick={logout} type="text">
              Выйти
            </Button>
          </Space>
        </Header>
        <Content style={{ margin: 24, background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
