import { useNavigate } from 'react-router-dom';
import styles from '../styles/PersonCard.module.css';

export function PersonCard({ person }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/persons/${person.id}`);
  };

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        {person.image ? (
          <img
            src={person.image}
            alt={person.name}
            className={styles.image}
          />
        ) : (
          <div className={styles.testphoto} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{person.name.toUpperCase()}</h3>

        <div className={styles.description}>
          <span className={styles.label}>
            {person.description}
          </span>
        </div>
      </div>
    </article>
  );
}