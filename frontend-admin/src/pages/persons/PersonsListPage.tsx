import { Table, Button, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePersons, useDeletePerson, usePublishPerson } from 'entities/person/queries';
import { PublishToggle } from 'features/publish-toggle/PublishToggle';
import { formatDate } from 'shared/lib/format';
import type { PersonDto } from 'entities/person/types';
import { ROUTES } from 'shared/config/routes';

export function PersonsListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = usePersons();
  const deleteMutation = useDeletePerson();
  const publishMutation = usePublishPerson();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Персона удалена');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const columns = [
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    {
      title: 'Профессия',
      dataIndex: 'profession',
      key: 'profession',
      render: (v?: string) => v ?? '—',
    },
    {
      title: 'Опубликовано',
      key: 'is_published',
      render: (_: unknown, record: PersonDto) => (
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
      render: (_: unknown, record: PersonDto) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(ROUTES.PERSONS_EDIT(record._id))}
          />
          <Popconfirm title="Удалить персону?" onConfirm={() => handleDelete(record._id)}>
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
          Персоны
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.PERSONS_NEW)}
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
