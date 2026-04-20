import { ExcursionCard } from 'entities/excursions';
import styles from '../styles/ExcursionList.module.css';

export function ExcursionList({ excursions }) {
  return (
    <div className={styles.grid}>
      {excursions.map(excursion => (
        <ExcursionCard
          key={excursion.id}
          excursion={excursion}
        />
      ))}
    </div>
  );
}