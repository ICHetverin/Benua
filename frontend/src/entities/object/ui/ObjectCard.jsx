import { useNavigate } from 'react-router-dom';
import styles from '../styles/ObjectCard.module.css';

export function ObjectCard({ object }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/objects/${object._id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  const descriptionText = Array.isArray(object.description)
    ? (object.description[0]?.content || object.description[0]?.topic || '')
    : (object.description || '');


  return (
    <article
      className={styles.card}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {object.images?.[0]
          ? <img className={styles.image} src={object.images[0].url_to_s3} alt={object.name} loading="lazy" />
          : <div className={styles.imagePlaceholder} />
        }
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{object.name}</h3>
        <p className={styles.description}>{descriptionText}</p>
      </div>
    </article>
  );
}
