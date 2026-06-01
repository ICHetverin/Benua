import { useNavigate } from 'react-router-dom';
import styles from '../styles/InfographicCard.module.css';

export function InfographicCard({ infographic }) {
  const navigate = useNavigate();

  const firstFile = infographic.files?.[0];
  const coverUrl = firstFile?.type !== 'PDF' ? (firstFile?.url ?? null) : null;

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/infographics/${infographic._id}`)}
    >
      <div className={styles.imageWrapper}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={infographic.name}
            className={styles.image}
            loading="lazy"
          />
        ) : firstFile?.type === 'PDF' ? (
          <div className={styles.pdfPlaceholder}>
            <svg viewBox="0 0 48 48" fill="none" className={styles.pdfIcon}>
              <rect x="8" y="2" width="32" height="44" rx="3" fill="#f5f5f5" stroke="#d9d9d9" strokeWidth="1.5"/>
              <path d="M28 2v12h12" stroke="#d9d9d9" strokeWidth="1.5"/>
              <path d="M28 2l12 12" stroke="#d9d9d9" strokeWidth="1.5"/>
              <text x="24" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#c0392b" fontFamily="sans-serif">PDF</text>
            </svg>
          </div>
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
