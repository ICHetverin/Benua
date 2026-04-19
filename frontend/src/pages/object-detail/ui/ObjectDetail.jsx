import { useParams, useNavigate } from 'react-router-dom';
import { getObjectById } from 'entities/object';
import { PersonCard, getPersonById } from 'entities/person';
import styles from '../styles/ObjectDetail.module.css';

export function ObjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const object = getObjectById(id);

  if (!object) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Объект не найден</p>
      </div>
    );
  }

  const relatedPersons = (object.relatedPersonIds ?? [])
    .map(getPersonById)
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <h1 className={styles.name}>{object.name}</h1>

      <div className={styles.gallery}>
        {object.images?.length > 0
          ? object.images.map((src, i) => (
              <img key={i} className={styles.image} src={src} alt={`${object.name} ${i + 1}`} loading="lazy" />
            ))
          : <div className={styles.imagePlaceholder} />
        }
      </div>

      <p className={styles.description}>{object.description}</p>

      {relatedPersons.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Связанные персоны</h2>
          <div className={styles.grid}>
            {relatedPersons.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
