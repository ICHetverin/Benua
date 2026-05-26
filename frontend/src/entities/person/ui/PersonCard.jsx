import { useNavigate } from 'react-router-dom';
import styles from '../styles/PersonCard.module.css';

export function PersonCard({ person }) {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(`/persons/${person._id}`);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  const descriptionText = person.profession
    || (Array.isArray(person.description)
      ? person.description[0]?.content || person.description[0]?.topic || ''
      : person.description || '');

  return (
    <article
      className={styles.card}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {(() => {
          const coverImage =
            (person.featured_image_id &&
              person.images?.find((img) => img._id === person.featured_image_id)) ||
            person.images?.[0];
          return coverImage?.url_to_s3
            ? <img className={styles.image} src={coverImage.url_to_s3} alt={person.name} loading="lazy" />
            : <div className={styles.imagePlaceholder} />;
        })()}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{person.name}</h3>
        {descriptionText && <p className={styles.description}>{descriptionText}</p>}
      </div>
    </article>
  );
}
