import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useObjectById } from 'entities/object';
import styles from './KeyWorks.module.css';

const INITIAL_VISIBLE = 3;

const PinIcon = () => (
  <svg viewBox="0 0 14 18" fill="currentColor" className={styles.cardIcon}>
    <path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 13 5 13s5-9.25 5-13c0-2.76-2.24-5-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={styles.cardIcon}>
    <path d="M9 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.87 0-7 1.57-7 3.5V16h14v-1.5c0-1.93-3.13-3.5-7-3.5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={styles.cardIcon}>
    <path d="M5 1v2H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2V1h-2v2H7V1H5zm-2 6h12v9H3V7z" />
  </svg>
);

const KeyWorkCard = ({ objectId, fallbackName }) => {
  const navigate = useNavigate();
  const { data: object } = useObjectById(objectId);

  const name = object?.name ?? fallbackName;
  const image = object?.images?.[0];

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/objects/${objectId}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/objects/${objectId}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {image ? (
          <img src={image.url_to_s3} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardName}>{name?.toUpperCase()}</h3>
        {object?.address && (
          <div className={styles.cardMeta}>
            <PinIcon />
            <span>{object.address}</span>
          </div>
        )}
        {object?.architect && (
          <div className={styles.cardMeta}>
            <PersonIcon />
            <span>{object.architect}</span>
          </div>
        )}
        {object?.years_built && (
          <div className={styles.cardMeta}>
            <CalendarIcon />
            <span>{object.years_built}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export const KeyWorks = ({ objects = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!objects.length) return null;

  const visible = expanded ? objects : objects.slice(0, INITIAL_VISIBLE);
  const hasMore = objects.length > INITIAL_VISIBLE;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Ключевые работы</h2>
        <div className={styles.grid}>
          {visible.map((obj) => (
            <KeyWorkCard key={obj._id} objectId={obj._id} fallbackName={obj.name} />
          ))}
        </div>
        {hasMore && (
          <button
            className={styles.showAll}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Скрыть ↑' : 'Показать все ↓'}
          </button>
        )}
      </div>
    </section>
  );
};
