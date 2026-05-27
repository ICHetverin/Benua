import { BurialPersonCard } from "../BurialPersonCard/BurialPersonCard";
import styles from "./PetersburgView.module.css";

/**
 * Плоский список кладбищ для вида «Петербург».
 * Нет city-аккордеона — кладбища идут напрямую как секции.
 * При наличии `cemetery.images` они отображаются вперемешку с карточками.
 */
export function PetersburgView({ cemeteries }) {
  return (
    <div className={styles.wrapper}>
      {cemeteries.map((cemetery) => (
        <section key={cemetery.id} className={styles.section} id={cemetery.id}>
          {/* Название кладбища с красной чертой */}
          <h2 className={styles.cemeteryTitle}>{cemetery.name}</h2>

          {/* Сетка: карточки персон + опционально фото */}
          <div className={styles.grid}>
            {cemetery.persons.map((person, idx) => (
              <BurialPersonCard key={idx} person={person} />
            ))}

            {cemetery.images && cemetery.images.map((src, idx) => (
              <div key={`img-${idx}`} className={styles.photoCard}>
                <img
                  src={src}
                  alt={`${cemetery.name} — фото ${idx + 1}`}
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
