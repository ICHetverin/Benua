import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBurials, useDeleteBurial, usePublishBurial } from 'entities/burial/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { BurialDto } from 'entities/burial/types';
import { ROUTES } from 'shared/config/routes';

export function BurialsListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useBurials();
  const deleteMutation = useDeleteBurial();
  const publishMutation = usePublishBurial();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Захоронение удалено');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Город', dataIndex: 'city', key: 'city' },
    {
      title: 'Кладбище',
      dataIndex: 'cemetery_name',
      key: 'cemetery_name',
      render: (v?: string) => v ?? 'Неизвестное место захоронения',
    },
    { title: 'Годы жизни', dataIndex: 'life_years', key: 'life_years', render: (v?: string) => v ?? '—' },
    {
      title: 'Опубликовано',
      key: 'is_published',
      render: (_: unknown, record: BurialDto) => (
        <PublishToggle
          value={!!record.is_published}
          loading={publishMutation.isPending}
          onChange={(v) => publishMutation.mutate({ id: record._id, value: v })}
        />
      ),
    },
    {
      title: 'Обновлено',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (v?: string) => formatDate(v),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: BurialDto) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTES.BURIALS_EDIT(record._id))}
          />
          <Popconfirm title="Удалить захоронение?" onConfirm={() => handleDelete(record._id)}>
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
          Захоронения
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.BURIALS_NEW)}>
          Добавить
        </Button>
      </Space>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data ?? []}
        loading={isLoading}
        pagination={{ pageSize: 20 }}
      />
    </>
  );
}
