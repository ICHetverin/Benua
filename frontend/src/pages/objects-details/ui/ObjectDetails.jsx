import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from 'shared/api/api';

export function ObjectDetails() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['object', id],
    queryFn: () => api.getObjectById(id)
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка</div>;

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{data.title}</h1>
      <p>{data.address}</p>
      <p>{data.authors}</p>
      <p>{data.category}</p>
      <p>{data.subcategory}</p>
    </div>
  );
}