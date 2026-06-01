import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInfographicById } from 'entities/infographic';
import { usePersonById } from 'entities/person';
import { useObjectById } from 'entities/object';
import { LightboxProvider } from 'shared/ui/Lightbox';
import { ArrowIcon } from 'shared/assets/icons/ArrowIcon';
import styles from './InfographicDetail.module.css';

function RelatedPersonCard({ personId, name: fallbackName }) {
  const navigate = useNavigate();
  const { data: person } = usePersonById(personId);
  const photoUrl = person?.images?.[0]?.url_to_s3;
  const name = person?.name ?? fallbackName;

  return (
    <article className={styles.relatedCard} onClick={() => navigate(`/persons/${personId}`)}>
      <div className={styles.relatedPhoto}>
        {photoUrl ? (
          <img src={photoUrl} alt={name} className={styles.relatedImg} loading="lazy" />
        ) : (
          <div className={styles.relatedPlaceholder} />
        )}
      </div>
      <p className={styles.relatedName}>{name?.toUpperCase()}</p>
    </article>
  );
}

function RelatedObjectCard({ objectId, name: fallbackName }) {
  const navigate = useNavigate();
  const { data: obj } = useObjectById(objectId);
  const photoUrl = obj?.images?.[0]?.url_to_s3;
  const name = obj?.name ?? fallbackName;

  return (
    <article className={styles.relatedCard} onClick={() => navigate(`/objects/${objectId}`)}>
      <div className={styles.relatedPhoto}>
        {photoUrl ? (
          <img src={photoUrl} alt={name} className={styles.relatedImg} loading="lazy" />
        ) : (
          <div className={styles.relatedPlaceholder} />
        )}
      </div>
      <p className={styles.relatedName}>{name?.toUpperCase()}</p>
    </article>
  );
}

export function InfographicDetail() {
  const { id } = useParams();
  const { data: infographic, isLoading, isError } = useInfographicById(id);

  if (isLoading) {
    return (
      <div className={styles.stateWrapper}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (isError || !infographic) {
    return (
      <div className={styles.stateWrapper}>
        <p>Инфографика не найдена.</p>
        <Link to="/infographics" className={styles.backLink}>← Все инфографики</Link>
      </div>
    );
  }

  const hasRelated =
    infographic.connected_persons?.length > 0 ||
    infographic.connected_objects?.length > 0;

  return (
    <LightboxProvider>
      <div className={styles.page}>
      {/* ── Заголовок ── */}
      <section className={styles.hero}>
        <h1 className={styles.title}>{infographic.name}</h1>
      </section>

      {/* ── Файлы работы ── */}
      {infographic.files?.length > 0 && (
        <section className={styles.workSection}>
          {infographic.files.map((file, idx) =>
            file.type === 'PDF' ? (
              <div key={file.key ?? idx} className={styles.pdfWrapper}>
                <div className={styles.pdfToolbar}>
                  <span className={styles.pdfFileName}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ flexShrink: 0 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                    </svg>
                    {file.key?.split('/').pop() ?? 'документ.pdf'}
                  </span>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pdfOpenLink}
                  >
                    Открыть в новой вкладке ↗
                  </a>
                </div>
                <iframe
                  src={file.url}
                  title={file.key?.split('/').pop() ?? `PDF ${idx + 1}`}
                  className={styles.pdfEmbed}
                />
                <p className={styles.pdfFallbackHint}>
                  Если документ не отображается —{' '}
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.pdfFallbackLink}>
                    скачайте PDF
                  </a>.
                </p>
              </div>
            ) : (
              <img
                key={file.key ?? idx}
                src={file.url}
                alt={`${infographic.name} — файл ${idx + 1}`}
                className={styles.workImage}
              />
            )
          )}
        </section>
      )}

      {/* ── Авторы + описание ── */}
      <section className={styles.metaSection}>
        {infographic.authors?.length > 0 && (
          <p className={styles.authors}>{infographic.authors.join(', ')}</p>
        )}
        {infographic.description && (
          <p className={styles.description}>{infographic.description}</p>
        )}
      </section>

      {/* ── Связанные карточки ── */}
      {hasRelated && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Связанные материалы</h2>
          <div className={styles.relatedGrid}>
            {infographic.connected_persons?.map((p) => (
              <RelatedPersonCard key={p._id} personId={p._id} name={p.name} />
            ))}
            {infographic.connected_objects?.map((o) => (
              <RelatedObjectCard key={o._id} objectId={o._id} name={o.name} />
            ))}
          </div>
        </section>
      )}

      {/* ── Источники ── */}
      {infographic.sources?.length > 0 && (
        <section className={styles.sourcesSection}>
          <div className={styles.sourcesContainer}>
            <h2 className={styles.sourcesTitle}>Источники и материалы</h2>
            <ul className={styles.sourcesList}>
              {infographic.sources.map((src) => (
                <li key={src._id ?? src.url} className={styles.sourceItem}>
                  <ArrowIcon className={styles.sourceArrow} width={12} height={12} />
                  <a
                    href={src.url}
                    className={styles.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {src.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      </div>
    </LightboxProvider>
  );
}
