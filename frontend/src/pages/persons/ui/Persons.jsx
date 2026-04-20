import { PersonCard, usePersons } from 'entities/person';
import { CatalogGrid } from 'widgets/catalog-grid';

export function Persons() {
  const { data: persons = [], isLoading, isError } = usePersons();

  return (
    <div style={{ padding: 'var(--page-padding)' }}>
      <CatalogGrid
        items={persons}
        renderCard={(person) => <PersonCard key={person.id} person={person} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
