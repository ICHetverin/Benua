import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCemeteries, useDeleteCemetery, usePublishCemetery } from 'entities/cemetery/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { CemeteryDto } from 'entities/cemetery/types';
import { ROUTES } from 'shared/config/routes';

export function CemeteriesListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useCemeteries();
  const deleteMutation = useDeleteCemetery();
  const publishMutation = usePublishCemetery();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Кладбище удалено');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Опубликовано',
      key: 'is_published',
      render: (_: unknown, record: CemeteryDto) => (
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
      render: (_: unknown, record: CemeteryDto) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTES.CEMETERIES_EDIT(record._id))}
          />
          <Popconfirm title="Удалить кладбище?" onConfirm={() => handleDelete(record._id)}>
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
          Кладбища Петербурга
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.CEMETERIES_NEW)}>
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
