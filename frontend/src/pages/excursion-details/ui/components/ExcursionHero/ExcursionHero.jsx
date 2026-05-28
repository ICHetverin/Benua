import { PASSING_METHOD_LABELS, TYPE_LABELS } from "entities/excursions";
import styles from "./ExcursionHero.module.css";

export const ExcursionHero = ({ excursion }) => {
  const tags = [
    excursion.type ? (TYPE_LABELS[excursion.type] ?? excursion.type) : null,
    ...(excursion.passing_methods ?? []).map((m) => PASSING_METHOD_LABELS[m] ?? m),
    excursion.time ?? null,
  ].filter(Boolean);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <p className={styles.breadcrumb}>( Экскурсии )</p>
        <h1 className={styles.title}>{excursion.name?.toUpperCase()}</h1>

        <div className={styles.contentGrid}>
          <div className={styles.descriptionColumn}>
            <h3 className={styles.routeLabel}>Маршрут и описание экскурсии</h3>

            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {excursion.description && (
              <p className={styles.description}>{excursion.description}</p>
            )}
          </div>

          <div className={styles.mapColumn}>
            <div className={styles.mapPlaceholder}>
              <p className={styles.mapPlaceholderText}>Карта маршрута</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
