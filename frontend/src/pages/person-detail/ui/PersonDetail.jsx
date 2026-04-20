import { useParams, useNavigate } from 'react-router-dom';
import { usePersonById, getPersonById } from 'entities/person';
import { ObjectCard, useObjects, getObjectById } from 'entities/object';
import styles from '../styles/PersonDetail.module.css';

export function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: person, isLoading, isError } = usePersonById(id);
  const { data: allObjects = [] } = useObjects();

  if (isLoading) return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  if (isError || !person) return <div className={styles.page}><p className={styles.statusError}>Персона не найдена</p></div>;

  const relatedObjects = (person.relatedObjectIds ?? [])
    .map((oid) => getObjectById(oid, allObjects))
    .filter(Boolean);

  const getDescriptionText = (description) => {
  if (!description) return 'Нет описания';
  if (typeof description === 'string') return description;
  if (typeof description === 'object') {
    if (description.content) return description.content;
    if (description.topic) return description.topic;
    return JSON.stringify(description);
  }
  return String(description);
  };

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.hero}>
        <div className={styles.photoWrapper}>
          {person.photo
            ? <img className={styles.photo} src={person.photo} alt={person.name} />
            : <div className={styles.photoPlaceholder} />
          }
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{person.name}</h1>
          <p className={styles.description}>{getDescriptionText(person.description)}</p>
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
