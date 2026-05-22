import { Link } from "react-router-dom";
import { PASSING_METHOD_LABELS } from "entities/excursions";
import styles from "./ExcursionsSection.module.css";

export const HomeExcursionCard = ({ excursion }) => {
  const tags = [
    ...(excursion.passing_methods ?? []).map((m) => PASSING_METHOD_LABELS[m] ?? m),
    excursion.duration_minutes ? `${excursion.duration_minutes} мин` : null,
  ].filter(Boolean);

  const coverUrl = excursion.cover_image?.url_to_s3 ?? excursion.images?.[0]?.url_to_s3;

  return (
    <article className={styles.excursionCard}>
      <div className={styles.excursionCardLeft}>
        <div className={styles.excursionTags}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.excursionTag}>
              {tag}
            </span>
          ))}
        </div>
        <h3 className={styles.excursionTitle}>{excursion.name?.toUpperCase()}</h3>
        <Link
          to={`/excursions/${excursion._id}`}
          className={styles.excursionLink}
        >
          Подробнее
        </Link>
      </div>
      <div className={styles.excursionCardRight}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={excursion.name}
            className={styles.excursionImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.excursionImagePlaceholder} />
        )}
      </div>
    </article>
  );
};
