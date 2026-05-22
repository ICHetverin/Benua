import { useNavigate } from "react-router-dom";
import styles from "./ObjectCatalogCard.module.css";

const PinIcon = () => (
  <svg viewBox="0 0 16 20" fill="currentColor" className={styles.icon}>
    <path d="M8 0C4.69 0 2 2.69 2 6c0 4.5 6 14 6 14s6-9.5 6-14c0-3.31-2.69-6-6-6zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
    <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.42 0-8 1.79-8 4v1h16v-1c0-2.21-3.58-4-8-4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={styles.icon}>
    <path d="M6 1v2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2V1h-2v2H8V1H6zm-2 6h12v9H4V7z" />
  </svg>
);

const formatPersons = (persons = []) => {
  if (!persons.length) return null;
  if (persons.length <= 2) return persons.map((p) => p.name).join(", ");
  return persons
    .slice(0, 2)
    .map((p) => p.name)
    .join(", ") + " и др.";
};

export const ObjectCatalogCard = ({ object }) => {
  const navigate = useNavigate();

  const coverUrl = object.images?.[0]?.url_to_s3;
  const personsText = formatPersons(object.connected_persons);

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/objects/${object._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/objects/${object._id}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.imageWrapper}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={object.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{object.name?.toUpperCase()}</h3>

        {object.address && (
          <div className={styles.metaRow}>
            <PinIcon />
            <span className={styles.metaText}>{object.address}</span>
          </div>
        )}

        {personsText && (
          <div className={styles.metaRow}>
            <PersonIcon />
            <span className={styles.metaText}>{personsText}</span>
          </div>
        )}

        {object.years_built && (
          <div className={styles.metaRow}>
            <CalendarIcon />
            <span className={styles.metaText}>{object.years_built}</span>
          </div>
        )}
      </div>
    </article>
  );
};
