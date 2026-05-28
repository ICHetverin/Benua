import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  useInfographics,
  useDeleteInfographic,
  usePublishInfographic,
} from 'entities/infographic/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { InfographicDto } from 'entities/infographic/types';
import { ROUTES } from 'shared/config/routes';

export function InfographicsListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useInfographics();
  const deleteMutation = useDeleteInfographic();
  const publishMutation = usePublishInfographic();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Инфографика удалена');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Авторы',
      key: 'authors',
      render: (_: unknown, r: InfographicDto) => r.authors?.join(', ') ?? '—',
    },
    {
      title: 'Опубликовано',
      key: 'is_published',
      render: (_: unknown, r: InfographicDto) => (
        <PublishToggle
          value={!!r.is_published}
          loading={publishMutation.isPending}
          onChange={(v) => publishMutation.mutate({ id: r._id, value: v })}
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
      render: (_: unknown, r: InfographicDto) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTES.INFOGRAPHICS_EDIT(r._id))}
          />
          <Popconfirm title="Удалить инфографику?" onConfirm={() => handleDelete(r._id)}>
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
          Инфографика
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.INFOGRAPHICS_NEW)}
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
