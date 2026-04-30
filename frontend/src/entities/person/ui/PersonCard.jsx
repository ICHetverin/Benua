import { useNavigate } from 'react-router-dom';
import styles from '../styles/PersonCard.module.css';

export function PersonCard({ person }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/persons/${person._id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  const descriptionText = Array.isArray(person.description)
    ? (person.description[0]?.content || person.description[0]?.topic || '')
    : (person.description || '');

  return (
    <article
      className={styles.card}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className={styles.photoWrapper}>
        {person.images?.[0]?.url_to_s3
          ? <img className={styles.photo} src={person.images[0].url_to_s3} alt={person.name} loading="lazy" />
          : <div className={styles.photoPlaceholder} />
        }
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{person.name}</h3>
        <p className={styles.description}>{descriptionText}</p>
      </div>
    </article>
  );
}
