import { useNavigate } from 'react-router-dom';
import { ObjectCard, useObjects } from 'entities/object';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from './Objects.module.css';

export function Objects() {
  const { data: objects = [], isLoading, isError } = useObjects();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button type="button" className={styles.addBtn} onClick={() => navigate('/objects/new')}>
          + Добавить объект
        </button>
      </div>
      <CatalogGrid
        items={objects}
        renderCard={(obj) => <ObjectCard key={obj._id} object={obj} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
