import { Typography, Card, Row, Col } from 'antd';
import { usePersons } from 'entities/person/queries';
import { useBuildings } from 'entities/building/queries';
import { useExcursions } from 'entities/excursion/queries';

export function DashboardPage() {
  const { data: persons } = usePersons();
  const { data: buildings } = useBuildings();
  const { data: excursions } = useExcursions();

  const stats = [
    { title: 'Персоны', value: persons?.length ?? 0 },
    { title: 'Объекты', value: buildings?.length ?? 0 },
    { title: 'Экскурсии', value: excursions?.length ?? 0 },
  ];

  return (
    <>
      <Typography.Title level={3}>Дашборд</Typography.Title>
      <Row gutter={16}>
        {stats.map((s) => (
          <Col key={s.title} xs={24} sm={8}>
            <Card>
              <Typography.Statistic title={s.title} value={s.value} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
