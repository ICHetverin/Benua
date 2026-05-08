import { PersonCard, usePersons } from 'entities/person';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from './Persons.module.css';

export function Persons() {
  const { data: persons = [], isLoading, isError } = usePersons();

  return (
    <div className={styles.page}>
      <CatalogGrid
        items={persons}
        renderCard={(person) => <PersonCard key={person._id} person={person} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
