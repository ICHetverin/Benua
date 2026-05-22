import { useNavigate } from 'react-router-dom';
import { PASSING_METHOD_LABELS } from '../model/passingMethods';
import styles from '../styles/ExcursionCard.module.css';

export function ExcursionCard({ excursion }) {
  const navigate = useNavigate();

  const labels = [
    excursion.mode ? PASSING_METHOD_LABELS[excursion.mode] ?? excursion.mode : null,
    excursion.durationMinutes ? `${excursion.durationMinutes} мин` : null,
  ].filter(Boolean);

  return (
    <article className={styles.card} onClick={() => navigate(`/excursions/${excursion._id}`)}>
      <div className={styles.imageWrapper}>
        <div className={styles.testphoto} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{excursion.title?.toUpperCase()}</h3>

        <div className={styles.description}>
          {labels.map((item, index) => (
            <span key={index} className={styles.label}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
