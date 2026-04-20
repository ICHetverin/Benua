import styles from '../styles/CatalogGrid.module.css';

export function CatalogGrid({ items = [], renderCard, isLoading, isError }) {
  if (isLoading) return <p className={styles.status}>Загрузка...</p>;
  if (isError) return <p className={styles.statusError}>Ошибка загрузки данных</p>;

  return (
    <div className={styles.grid}>
      {items.map(renderCard)}
    </div>
  );
}
