import { usePersonsQuery } from 'entities/persons/query/query';

export function Persons() {
  const { data: persons, isLoading, error } = usePersonsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      <h1 style={{ padding: "2rem", textAlign: "center" }}>Персоналии</h1>
      {persons?.map((person) => (
        <div key={person.id} style={{ marginBottom: "1rem" }}>
          <h3>{person.name}</h3>
          <p>{person.description}</p>
        </div>
      ))}
    </div>
  );
}