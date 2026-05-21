import { Typography, Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePersons } from 'entities/person/queries';
import { useBuildings } from 'entities/building/queries';
import { useExcursions } from 'entities/excursion/queries';
import { useActivity } from 'entities/activity/queries';
import type { ActivityItem, EntityType } from 'entities/activity/types';
import { ROUTES } from 'shared/config/routes';
import { formatDate } from 'shared/lib/format';

const ENTITY_LABELS: Record<EntityType, string> = {
  person: 'Персона',
  building: 'Объект',
  excursion: 'Экскурсия',
};

const ENTITY_COLORS: Record<EntityType, string> = {
  person: 'blue',
  building: 'green',
  excursion: 'purple',
};

function editRoute(type: EntityType, id: string): string {
  if (type === 'person') return ROUTES.PERSONS_EDIT(id);
  if (type === 'building') return ROUTES.BUILDINGS_EDIT(id);
  return ROUTES.EXCURSIONS_EDIT(id);
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: persons } = usePersons();
  const { data: buildings } = useBuildings();
  const { data: excursions } = useExcursions();
  const { data: activity, isLoading: activityLoading } = useActivity(20);

  const stats = [
    { title: 'Персоны', value: persons?.length ?? 0 },
    { title: 'Объекты', value: buildings?.length ?? 0 },
    { title: 'Экскурсии', value: excursions?.length ?? 0 },
  ];

  const columns = [
    {
      title: 'Название',
      key: 'name',
      render: (_: unknown, record: ActivityItem) => (
        <a onClick={() => navigate(editRoute(record.entity_type, record._id))}>{record.name}</a>
      ),
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (v: string) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v}</span>,
    },
    {
      title: 'Тип',
      dataIndex: 'entity_type',
      key: 'entity_type',
      render: (v: EntityType) => (
        <Tag color={ENTITY_COLORS[v]}>{ENTITY_LABELS[v]}</Tag>
      ),
    },
    {
      title: 'Изменено',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (v: string) => formatDate(v),
    },
    {
      title: 'Кем',
      dataIndex: 'updated_by',
      key: 'updated_by',
      render: (v: string | null) => v ?? '—',
    },
  ];

  return (
    <>
      <Typography.Title level={3}>Дашборд</Typography.Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <Col key={s.title} xs={24} sm={8}>
            <Card>
              <Statistic title={s.title} value={s.value} />
            </Card>
          </Col>
        ))}
      </Row>
      <Card title="Последние изменения">
        <Table
          rowKey="_id"
          size="small"
          columns={columns}
          dataSource={activity ?? []}
          loading={activityLoading}
          pagination={false}
        />
      </Card>
    </>
  );
}
