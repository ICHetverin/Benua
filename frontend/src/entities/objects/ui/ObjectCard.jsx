import { useNavigate } from 'react-router-dom';
import styles from '../styles/ObjectCard.module.css';

export function ObjectCard({ object }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/objects/${object.id}`);
  };

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        {object.image ? (
          <img
            src={object.image}
            alt={object.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.testphoto} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {object.title.toUpperCase()}
        </h3>

        <div className={styles.description}>
          <span className={styles.label}>
            {object.address}
          </span>

          <span className={styles.label}>
            {object.authors}
          </span>
        </div>
      </div>
    </article>
  );
}