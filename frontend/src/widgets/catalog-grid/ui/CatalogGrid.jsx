import styles from '../styles/CatalogGrid.module.css';

export function CatalogGrid({ items, renderCard, isLoading, isError, emptyText = 'Пока ничего нет' }) {
  if (isLoading) return <p className={styles.status}>Загрузка...</p>;
  if (isError) return <p className={styles.statusError}>Ошибка загрузки данных</p>;

  const list = Array.isArray(items) ? items : [];

  if (list.length === 0) return <p className={styles.status}>{emptyText}</p>;

  return (
    <div className={styles.grid}>
      {list.map(renderCard)}
    </div>
  );
}
