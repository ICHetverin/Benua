import { useParams, useNavigate } from 'react-router-dom';
import { useObjectById } from 'entities/object';
import { PersonCard, usePersons, getPersonById } from 'entities/person';
import styles from '../styles/ObjectDetail.module.css';

export function ObjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: object, isLoading, isError } = useObjectById(id);
  const { data: allPersons = [] } = usePersons();

  if (isLoading) return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  if (isError || !object) return <div className={styles.page}><p className={styles.statusError}>Объект не найден</p></div>;

  const relatedPersons = (object.relatedPersonIds ?? [])
    .map((pid) => getPersonById(pid, allPersons))
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
