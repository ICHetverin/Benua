import { ObjectCard, useObjects } from 'entities/object';
import { CatalogGrid } from 'widgets/catalog-grid';
import styles from './Objects.module.css';

export function Objects() {
  const { data: objects = [], isLoading, isError } = useObjects();

  return (
    <div className={styles.page}>
      <CatalogGrid
        items={objects}
        renderCard={(obj) => <ObjectCard key={obj._id} object={obj} />}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
