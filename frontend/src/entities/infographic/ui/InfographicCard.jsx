import { useNavigate } from 'react-router-dom';
import styles from '../styles/InfographicCard.module.css';

export function InfographicCard({ infographic }) {
  const navigate = useNavigate();

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/infographics/${infographic._id}`)}
    >
      <div className={styles.imageWrapper}>
        {infographic.file_url ? (
          <img
            src={infographic.file_url}
            alt={infographic.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{infographic.name?.toUpperCase()}</h3>
        {infographic.authors?.length > 0 && (
          <p className={styles.author}>{infographic.authors.join(', ')}</p>
        )}
      </div>
    </article>
  );
}
