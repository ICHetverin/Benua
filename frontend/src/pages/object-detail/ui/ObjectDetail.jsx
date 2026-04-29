import { useParams, useNavigate } from 'react-router-dom';
import { useObjectById, ObjectCard } from 'entities/object';
import { PersonCard } from 'entities/person';
import styles from '../styles/ObjectDetail.module.css';

export function ObjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: object, isLoading, isError } = useObjectById(id);

  if (isLoading) return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  if (isError || !object) return <div className={styles.page}><p className={styles.statusError}>Объект не найден</p></div>;

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.gallery}>
        {object.images?.length > 0
          ? object.images.map((img, i) => (
              <img key={img.id ?? i} className={styles.image} src={img.url_to_s3} alt={`${object.name} ${i + 1}`} loading="lazy" />
            ))
          : <div className={styles.imagePlaceholder} />
        }
      </div>

      <h1 className={styles.name}>{object.name}</h1>

      <div className={styles.mainInfo}>
        {object.address && <p className={styles.infoRow}><span className={styles.infoLabel}>Адрес:</span> {object.address}</p>}
        {object.architect && <p className={styles.infoRow}><span className={styles.infoLabel}>Архитектор:</span> {object.architect}</p>}
        {object.years_built && <p className={styles.infoRow}><span className={styles.infoLabel}>Годы постройки:</span> {object.years_built}</p>}
      </div>

      {object.history && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>История создания</h2>
          <p className={styles.text}>{object.history}</p>
        </section>
      )}

      {object.design && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Дизайн</h2>
          <p className={styles.text}>{object.design}</p>
        </section>
      )}

      {object.description?.length > 0 && (
        <section className={styles.section}>
          {object.description.map((d, i) => (
            <div key={i} className={styles.topic}>
              <h2 className={styles.topicTitle}>{d.topic}</h2>
              <p className={styles.topicContent}>{d.content}</p>
            </div>
          ))}
        </section>
      )}

      {object.interesting_facts?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Интересные факты</h2>
          <ul className={styles.factsList}>
            {object.interesting_facts.map((fact, i) => (
              <li key={i} className={styles.factsItem}>{fact}</li>
            ))}
          </ul>
        </section>
      )}

      {object.sources?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Источники</h2>
          <ul className={styles.sourcesList}>
            {object.sources.map((src) => (
              <li key={src._id}>
                <a href={src.url} className={styles.sourceLink} target="_blank" rel="noopener noreferrer">
                  {src.text}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {object.connected_persons?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные персоны</h2>
          <div className={styles.grid}>
            {object.connected_persons.map((p) => (
              <PersonCard key={p._id} person={p} />
            ))}
          </div>
        </section>
      )}

      {object.connected_objects?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Связанные объекты</h2>
          <div className={styles.grid}>
            {object.connected_objects.map((obj) => (
              <ObjectCard key={obj._id} object={obj} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
