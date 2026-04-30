import { useParams, useNavigate } from 'react-router-dom';
import { usePersonById, PersonCard } from 'entities/person';
import { ObjectCard } from 'entities/object';
import styles from '../styles/PersonDetail.module.css';

export function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: person, isLoading, isError } = usePersonById(id);

  if (isLoading) return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  if (isError || !person) return <div className={styles.page}><p className={styles.statusError}>Персона не найдена</p></div>;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.hero}>
        <div className={styles.photoWrapper}>
          {person.images?.[0]?.url_to_s3
            ? <img className={styles.photo} src={person.images[0].url_to_s3} alt={person.name} />
            : <div className={styles.photoPlaceholder} />
          }
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{person.name}</h1>
          {person.life_years && <p className={styles.meta}>{person.life_years}</p>}
          {person.profession && <p className={styles.meta}>{person.profession}</p>}
          {person.birth_place && <p className={styles.meta}>Место рождения: {person.birth_place}</p>}
        </div>
      </div>

      {person.connection_with_benua && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Связь с Бенуа</h2>
          <p className={styles.text}>{person.connection_with_benua}</p>
        </section>
      )}

      {person.description?.length > 0 && (
        <section className={styles.section}>
          {person.description.map((d, i) => (
            <div key={i} className={styles.topic}>
              <h2 className={styles.topicTitle}>{d.topic}</h2>
              <p className={styles.topicContent}>{d.content}</p>
            </div>
          ))}
        </section>
      )}

      {person.interesting_facts?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Интересные факты</h2>
          <ul className={styles.factsList}>
            {person.interesting_facts.map((fact, i) => (
              <li key={i} className={styles.factsItem}>{fact}</li>
            ))}
          </ul>
        </section>
      )}

      {person.sources?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Источники</h2>
          <ul className={styles.sourcesList}>
            {person.sources.map((src) => (
              <li key={src.id}>
                <a href={src.url} className={styles.sourceLink} target="_blank" rel="noopener noreferrer">
                  {src.text}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {person.connected_persons?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные персоны</h2>
          <div className={styles.grid}>
            {person.connected_persons.map((p) => (
              <PersonCard key={p._id} person={p} />
            ))}
          </div>
        </section>
      )}

      {person.connected_objects?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные объекты</h2>
          <div className={styles.grid}>
            {person.connected_objects.map((obj) => (
              <ObjectCard key={obj._id} object={obj} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
