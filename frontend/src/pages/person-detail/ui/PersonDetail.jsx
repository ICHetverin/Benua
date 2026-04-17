import { useParams, useNavigate } from 'react-router-dom';
import { getPersonById } from 'entities/person';
import { ObjectCard, getObjectById } from 'entities/object';
import styles from '../styles/PersonDetail.module.css';

export function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const person = getPersonById(id);

  if (!person) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Персона не найдена</p>
      </div>
    );
  }

  const relatedObjects = (person.relatedObjectIds ?? [])
    .map(getObjectById)
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.hero}>
        <div className={styles.photoWrapper}>
          {person.photo
            ? <img className={styles.photo} src={person.photo} alt={person.name} />
            : <div className={styles.photoPlaceholder} />
          }
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{person.name}</h1>
          <p className={styles.description}>{person.description}</p>
        </div>
      </div>

      {relatedObjects.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Связанные объекты</h2>
          <div className={styles.grid}>
            {relatedObjects.map((obj) => (
              <ObjectCard key={obj.id} object={obj} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
