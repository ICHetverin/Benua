import { useNavigate } from 'react-router-dom';
import { PersonCard, usePersons } from 'entities/person';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from './Persons.module.css';

export function Persons() {
  const { data: persons = [], isLoading, isError } = usePersons();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button type="button" className={styles.addBtn} onClick={() => navigate('/persons/new')}>
          + Добавить персону
        </button>
      </div>
      <CatalogGrid
        items={persons}
        renderCard={(person) => <PersonCard key={person._id} person={person} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
