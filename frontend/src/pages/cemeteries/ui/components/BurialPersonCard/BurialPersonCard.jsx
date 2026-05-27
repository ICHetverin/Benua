import { useNavigate } from "react-router-dom";
import styles from "./BurialPersonCard.module.css";

export function BurialPersonCard({ person }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (person.personId) navigate(`/persons/${person.personId}`);
  };

  return (
    <article
      className={`${styles.card} ${person.personId ? styles.clickable : ""}`}
      onClick={person.personId ? handleClick : undefined}
      role={person.personId ? "link" : undefined}
      tabIndex={person.personId ? 0 : undefined}
      onKeyDown={(e) => {
        if (person.personId && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <h3 className={styles.name}>{person.name}</h3>
      {person.dates && <p className={styles.dates}>{person.dates}</p>}
      {person.photo && (
        <img src={person.photo} alt={person.name} className={styles.photo} loading="lazy" />
      )}
      {person.description && (
        <p className={styles.description}>{person.description}</p>
      )}
    </article>
  );
}
