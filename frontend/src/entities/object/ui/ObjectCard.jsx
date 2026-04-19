import { useNavigate } from 'react-router-dom';
import styles from '../styles/ObjectCard.module.css';

export function ObjectCard({ object }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/objects/${object.id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <article
      className={styles.card}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {object.image
          ? <img className={styles.image} src={object.image} alt={object.name} loading="lazy" />
          : <div className={styles.imagePlaceholder} />
        }
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{object.name}</h3>
        <p className={styles.description}>{object.description}</p>
      </div>
    </article>
  );
}
