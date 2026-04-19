import { useObjectsQuery } from 'entities/objects/query/query';

export function Objects() {
  const { data: objects, isLoading, error } = useObjectsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      <h1 style={{ padding: "2rem", textAlign: "center" }}>Объекты</h1>

      {objects?.map((obj) => (
        <div key={obj.id} style={{ marginBottom: "1rem" }}>
          <h3>{obj.title}</h3>
          <p>{obj.address}</p>
          <p>{obj.category}</p>
        </div>
      ))}
    </div>
  );
}