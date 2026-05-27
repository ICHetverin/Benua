import { BurialPersonCard } from "../BurialPersonCard/BurialPersonCard";
import styles from "./PetersburgView.module.css";

/**
 * Список кладбищ для вида «Петербург».
 * cemetery.images — массив ImageDto { _id, url_to_s3, text }
 * cemetery.briefInfo — строка или null
 */
export function PetersburgView({ cemeteries }) {
  return (
    <div className={styles.wrapper}>
      {cemeteries.map((cemetery) => (
        <section key={cemetery.id} className={styles.section} id={cemetery.id}>
          <h2 className={styles.cemeteryTitle}>{cemetery.name}</h2>

          {cemetery.briefInfo && (
            <p className={styles.briefInfo}>{cemetery.briefInfo}</p>
          )}

          <div className={styles.grid}>
            {cemetery.persons.map((person, idx) => (
              <BurialPersonCard key={idx} person={person} />
            ))}

            {cemetery.images && cemetery.images.map((img, idx) => (
              <div key={`img-${idx}`} className={styles.photoCard}>
                <img
                  src={img.url_to_s3}
                  alt={img.text || `${cemetery.name} — фото ${idx + 1}`}
                  className={styles.photo}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
