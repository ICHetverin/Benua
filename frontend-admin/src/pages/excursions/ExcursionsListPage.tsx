import { Table, Button, Space, Typography, Popconfirm, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useExcursions, useDeleteExcursion, usePublishExcursion } from 'entities/excursion/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { ExcursionDto } from 'entities/excursion/types';
import { ROUTES } from 'shared/config/routes';

const MODE_LABELS: Record<string, string> = {
  PEDESTRIAN: 'Пешая',
  BUS: 'Автобусная',
  MIXED: 'Смешанная',
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
    { title: 'Название', dataIndex: 'title', key: 'title' },
    {
      title: 'Режим',
      dataIndex: 'mode',
      key: 'mode',
      render: (v: string) => <Tag>{MODE_LABELS[v] ?? v}</Tag>,
    },
    {
      title: 'Длительность',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      render: (v?: number) => (v ? `${v} мин` : '—'),
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
