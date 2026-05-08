import { Table, Button, Space, Typography, Popconfirm, message, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useUsers, useCreateUser, useDeleteUser } from 'entities/user/queries';
import { formatDate } from 'shared/lib/format';
import type { UserDto } from 'entities/user/types';

export function UsersListPage() {
  const { data: users = [], isLoading } = useUsers();
  const createMutation = useCreateUser();
  const deleteMutation = useDeleteUser();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    try {
      await createMutation.mutateAsync(values);
      message.success('Пользователь создан');
      setOpen(false);
      form.resetFields();
    } catch {
      message.error('Ошибка создания пользователя');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Пользователь удалён');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Логин', dataIndex: 'username', key: 'username' },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => roles.map((r) => <Tag key={r} color={r === 'ADMIN' ? 'red' : 'blue'}>{r}</Tag>),
    },
    {
      title: 'Создан',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v?: string) => formatDate(v),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: UserDto) => (
        <Popconfirm title="Удалить пользователя?" onConfirm={() => handleDelete(record._id)}>
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Пользователи
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Добавить
        </Button>
      </Space>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        pagination={false}
      />
      <Modal
        title="Новый пользователь"
        open={open}
        onOk={handleCreate}
        onCancel={() => { setOpen(false); form.resetFields(); }}
        confirmLoading={createMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Логин" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 8 }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="roles" label="Роли" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              options={[
                { value: 'ADMIN', label: 'ADMIN' },
                { value: 'EDITOR', label: 'EDITOR' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
