import { BurialPersonCard } from "../BurialPersonCard/BurialPersonCard";
import styles from "./PetersburgView.module.css";

export function PetersburgView({ cemeteries }) {
  return (
    <div className={styles.wrapper}>
      {cemeteries.map((cemetery) => (
        <section key={cemetery.id} className={styles.section} id={cemetery.id}>
          <h2 className={styles.cemeteryTitle}>{cemetery.name}</h2>

          {(cemetery.briefInfo || (cemetery.images && cemetery.images.length > 0)) && (
            <div className={styles.infoRow}>
              {cemetery.briefInfo && (
                <p className={styles.briefInfo}>{cemetery.briefInfo}</p>
              )}
              {cemetery.images && cemetery.images.length > 0 && (
                <div className={styles.photoWrap}>
                  <img
                    src={cemetery.images[0].url_to_s3}
                    alt={cemetery.images[0].text || cemetery.name}
                    className={styles.photo}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          )}

          {cemetery.persons.length > 0 && (
            <div className={styles.grid}>
              {cemetery.persons.map((person, idx) => (
                <BurialPersonCard key={idx} person={person} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
