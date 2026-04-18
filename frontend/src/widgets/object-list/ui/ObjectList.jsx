import styles from '../styles/ObjectList.module.css';
import { ObjectCard } from 'entities/objects';

export function ObjectList({ objects, selectedCategory }) {
  const filtered = objects.filter(
    obj => obj.category === selectedCategory
  );

  // группировка по подкатегориям
  const grouped = filtered.reduce((acc, obj) => {
    if (!acc[obj.subcategory]) {
      acc[obj.subcategory] = [];
    }
    acc[obj.subcategory].push(obj);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([subcategory, items]) => (
        <div key={subcategory} className={styles.section}>
          <h2 className={styles.subtitle}>{subcategory}</h2>

          <div className={styles.grid}>
            {items.map(object => (
              <ObjectCard key={object.id} object={object} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}