import { PersonCard, usePersons } from 'entities/person';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from './Persons.module.css';

export function Persons() {
  const { data: persons = [], isLoading, isError } = usePersons();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Персоналии</h1>
      <CatalogGrid
        items={persons}
        renderCard={(person) => <PersonCard key={person._id} person={person} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
