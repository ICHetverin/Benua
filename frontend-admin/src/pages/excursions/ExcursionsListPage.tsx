import { Table, Button, Space, Typography, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useExcursions, useDeleteExcursion, usePublishExcursion } from 'entities/excursion/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { ExcursionDto } from 'entities/excursion/types';
import { ROUTES } from 'shared/config/routes';

const PASSING_METHOD_LABELS: Record<string, string> = {
  on_foot: 'Пешая',
  by_bus: 'Автобусная',
  mixed: 'Смешанная',
};

export function ExcursionsListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useExcursions();
  const deleteMutation = useDeleteExcursion();
  const publishMutation = usePublishExcursion();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Экскурсия удалена');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Время',
      dataIndex: 'time',
      key: 'time',
      render: (v?: string) => v ?? '—',
    },
    {
      title: 'Способ',
      dataIndex: 'passing_methods',
      key: 'passing_methods',
      render: (methods?: string[]) =>
        methods?.length
          ? methods.map((m) => <Tag key={m}>{PASSING_METHOD_LABELS[m] ?? m}</Tag>)
          : '—',
    },
    {
      title: 'Опубликовано',
      key: 'is_published',
      render: (_: unknown, record: ExcursionDto) => (
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
      render: (_: unknown, record: ExcursionDto) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTES.EXCURSIONS_EDIT(record._id))}
          />
          <Popconfirm title="Удалить экскурсию?" onConfirm={() => handleDelete(record._id)}>
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
          Экскурсии
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.EXCURSIONS_NEW)}
        >
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
