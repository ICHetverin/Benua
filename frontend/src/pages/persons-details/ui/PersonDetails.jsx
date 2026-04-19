import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from 'shared/api/api';

export function PersonDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['person', id],
    queryFn: () => api.getPersonById(id)
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка</div>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
    </div>
  );
}