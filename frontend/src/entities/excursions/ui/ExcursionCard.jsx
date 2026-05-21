import { useNavigate } from 'react-router-dom';
import { PASSING_METHOD_LABELS } from '../model/excursion';
import styles from '../styles/ExcursionCard.module.css';

export function ExcursionCard({ excursion }) {
  const navigate = useNavigate();

  const labels = [
    excursion.time,
    ...(excursion.passing_methods ?? []).map(m => PASSING_METHOD_LABELS[m] ?? m),
  ].filter(Boolean);

  return (
    <article className={styles.card} onClick={() => navigate(`/excursions/${excursion._id}`)}>
      <div className={styles.imageWrapper}>
        <div className={styles.testphoto} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{excursion.name?.toUpperCase()}</h3>
        <div className={styles.description}>
          {labels.map((item, i) => (
            <span key={i} className={styles.label}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
