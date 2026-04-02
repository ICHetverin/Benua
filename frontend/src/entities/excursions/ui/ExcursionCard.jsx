import { useNavigate } from 'react-router-dom';
import styles from '../styles/ExcursionCard.module.css';

export function ExcursionCard({ excursion }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(excursion.id)
    navigate(`/excursions/${excursion.id}`);
  };

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
        {/* <img
          src={excursion.image}
          alt={excursion.title}
          className={styles.image}
          loading="lazy"
        /> */}
        <div className={styles.testphoto} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{excursion.title.toUpperCase()}</h3>

        <div className={styles.description}>
          {excursion.label.map((item, index) => (
            <span key={index} className={styles.label}>
              {item}
            </span>
          ))}
        </div>

      </div>
    </article>
  );
}