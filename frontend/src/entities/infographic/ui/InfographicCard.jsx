import { useNavigate } from 'react-router-dom';
import { PdfThumbnail } from 'shared/ui/PdfThumbnail/PdfThumbnail';
import styles from '../styles/InfographicCard.module.css';

export function InfographicCard({ infographic }) {
  const navigate = useNavigate();

  const firstFile = infographic.files?.[0];
  const isFirstPdf = firstFile?.type === 'PDF';
  const coverUrl = !isFirstPdf ? (firstFile?.url ?? null) : null;

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/infographics/${infographic._id}`)}
    >
      <div className={styles.imageWrapper}>
        {isFirstPdf ? (
          <PdfThumbnail
            url={firstFile.url}
            alt={infographic.name}
            canvasClassName={styles.image}
            placeholderClassName={styles.pdfPlaceholder}
          />
        ) : coverUrl ? (
          <img
            src={coverUrl}
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
