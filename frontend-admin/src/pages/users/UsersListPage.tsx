import { Table, Button, Space, Typography, Popconfirm, message, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from 'entities/user/queries';
import { formatDate } from 'shared/lib/format';
import type { UserDto } from 'entities/user/types';

export function UsersListPage() {
  const { data: users = [], isLoading } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserDto | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    try {
      await createMutation.mutateAsync(values);
      message.success('Пользователь создан');
      setCreateOpen(false);
      createForm.resetFields();
    } catch {
      message.error('Ошибка создания пользователя');
    }
  };

  const handleEditOpen = (record: UserDto) => {
    setEditTarget(record);
    editForm.setFieldsValue({ roles: record.roles, password: '' });
  };

  const handleEditSave = async () => {
    if (!editTarget) return;
    const values = await editForm.validateFields();
    try {
      const dto: { password?: string; roles?: string[] } = { roles: values.roles };
      if (values.password) dto.password = values.password;
      await updateMutation.mutateAsync({ id: editTarget._id, dto });
      message.success('Пользователь обновлён');
      setEditTarget(null);
      editForm.resetFields();
    } catch {
      message.error('Ошибка обновления пользователя');
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
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEditOpen(record)} />
          <Popconfirm title="Удалить пользователя?" onConfirm={() => handleDelete(record._id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Пользователи
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
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
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        confirmLoading={createMutation.isPending}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="username" label="Логин" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, min: 6 }]}>
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

      <Modal
        title={`Редактировать: ${editTarget?.username ?? ''}`}
        open={editTarget !== null}
        onOk={handleEditSave}
        onCancel={() => { setEditTarget(null); editForm.resetFields(); }}
        confirmLoading={updateMutation.isPending}
        okText="Сохранить"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="password"
            label="Новый пароль"
            help="Оставьте пустым, чтобы не менять"
          >
            <Input.Password placeholder="Минимум 6 символов" />
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
