import { useNavigate } from 'react-router-dom';
import styles from '../styles/PersonCard.module.css';

export function PersonCard({ person }) {
  const navigate = useNavigate();

  return (
    <article className={styles.card} onClick={() => navigate(`/persons/${person.id}`)}>
      <div className={styles.photoWrapper}>
        {person.photo
          ? <img className={styles.photo} src={person.photo} alt={person.name} loading="lazy" />
          : <div className={styles.photoPlaceholder} />
        }
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{person.name}</h3>
        <p className={styles.description}>{person.description}</p>
      </div>
    </article>
  );
}
