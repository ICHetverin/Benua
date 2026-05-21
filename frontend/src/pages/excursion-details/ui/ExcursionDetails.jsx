import { useParams, useNavigate } from 'react-router-dom';
import { useExcursionById, PASSING_METHOD_LABELS } from 'entities/excursions';
import styles from '../styles/ExcursionDetails.module.css';

export function ExcursionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: excursion, isLoading, isError } = useExcursionById(id);

  if (isLoading) return <div className={styles.page}><p className={styles.status}>Загрузка...</p></div>;
  if (isError || !excursion) return <div className={styles.page}><p className={styles.statusError}>Экскурсия не найдена</p></div>;

  const labels = [
    excursion.time,
    ...(excursion.passing_methods ?? []).map(m => PASSING_METHOD_LABELS[m] ?? m),
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>← Назад</button>

      <div className={styles.hero}>
        <div className={styles.coverWrapper}>
          <div className={styles.coverPlaceholder} />
        </div>
        <div className={styles.heroInfo}>
          <h1 className={styles.title}>{excursion.name?.toUpperCase()}</h1>
          <div className={styles.labels}>
            {labels.map((l, i) => <span key={i} className={styles.label}>{l}</span>)}
          </div>
          {excursion.guide && (
            <p className={styles.guide}>Гид: {excursion.guide}</p>
          )}
        </div>
      </div>

      {excursion.description && (
        <section className={styles.section}>
          <p className={styles.description}>{excursion.description}</p>
        </section>
      )}

      {excursion.key_points?.filter(Boolean).length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ключевые точки</h2>
          <ul className={styles.list}>
            {excursion.key_points.filter(Boolean).map((point, i) => (
              <li key={i} className={styles.listItem}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {excursion.text_content?.filter(s => s.topic || s.content).length > 0 && (
        <section className={styles.section}>
          {excursion.text_content.filter(s => s.topic || s.content).map((section, i) => (
            <div key={i} className={styles.topic}>
              {section.topic && <h2 className={styles.topicTitle}>{section.topic}</h2>}
              {section.content && <p className={styles.topicContent}>{section.content}</p>}
            </div>
          ))}
        </section>
      )}

      {excursion.sources?.filter(s => s.source || s.url).length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Источники</h2>
          <ul className={styles.sourcesList}>
            {excursion.sources.filter(s => s.source || s.url).map((src, i) => (
              <li key={i}>
                {src.url ? (
                  <a href={src.url} className={styles.sourceLink} target="_blank" rel="noopener noreferrer">
                    {src.source || src.url}
                  </a>
                ) : (
                  <span className={styles.sourceText}>{src.source}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
