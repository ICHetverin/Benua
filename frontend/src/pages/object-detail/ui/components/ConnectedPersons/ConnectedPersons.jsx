import { useNavigate } from "react-router-dom";
import { usePersonById } from "entities/person";
import styles from "./ConnectedPersons.module.css";

/* ── Single person card (lazy-loads full data) ── */
const ConnectedPersonCard = ({ personId, fallbackName }) => {
  const navigate = useNavigate();
  const { data: person } = usePersonById(personId);

  const photoUrl = person?.images?.[0]?.url_to_s3;
  const name = person?.name ?? fallbackName;

  const descriptionText = Array.isArray(person?.description)
    ? person.description[0]?.content ?? person.description[0]?.topic ?? ""
    : person?.description ?? "";

  return (
    <article
      className={styles.personCard}
      onClick={() => navigate(`/persons/${personId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/persons/${personId}`);
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className={styles.photoWrapper}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className={styles.photo}
            loading="lazy"
            data-no-lightbox="true"
          />
        ) : (
          <div className={styles.photoPlaceholder} />
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.personName}>{name?.toUpperCase()}</h3>
        {descriptionText && (
          <p className={styles.personDesc}>{descriptionText}</p>
        )}
      </div>
    </article>
  );
};

/* ── Section ── */
export const ConnectedPersons = ({ persons = [] }) => {
  if (!persons.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Люди, которые
          <br />
          относятся к этому месту
        </h2>
        <div className={styles.grid}>
          {persons.map((p) => (
            <ConnectedPersonCard
              key={p._id}
              personId={p._id}
              fallbackName={p.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
