import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'app/providers/auth/AuthContext';
import { ROUTES } from 'shared/config/routes';

interface FormValues {
  username: string;
  password: string;
}

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  if (user) {
    navigate(ROUTES.DASHBOARD, { replace: true });
    return null;
  }

  const onFinish = async (values: FormValues) => {
    try {
      await login(values.username, values.password);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      message.error('Неверный логин или пароль');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Benua Admin
        </Typography.Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Логин" rules={[{ required: true }]}>
            <Input autoFocus />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
