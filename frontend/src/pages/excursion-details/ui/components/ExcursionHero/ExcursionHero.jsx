import { useMemo } from "react";
import { PASSING_METHOD_LABELS } from "entities/excursions";
import { ExcursionRouteMap } from "../ExcursionRouteMap/ExcursionRouteMap";
import styles from "./ExcursionHero.module.css";

function buildYandexMapsUrl(points) {
  const geoPoints = points.filter((p) => p.lat != null && p.lng != null);
  if (geoPoints.length === 0) return null;
  const rtext = geoPoints.map((p) => `${p.lat},${p.lng}`).join("~");
  return `https://yandex.ru/maps/?rtext=${rtext}&rtt=pd`;
}

export const ExcursionHero = ({ excursion }) => {
  const tags = [
    ...(excursion.passing_methods ?? []).map((m) => PASSING_METHOD_LABELS[m] ?? m),
    excursion.time ?? null,
  ].filter(Boolean);

  const yandexUrl = useMemo(
    () => buildYandexMapsUrl(excursion.points ?? []),
    [excursion.points]
  );

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

            {yandexUrl && (
              <a
                href={yandexUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.yandexButton}
              >
                Сохранить маршрут в Яндекс Картах
              </a>
            )}
          </div>

          <div className={styles.mapColumn}>
            <ExcursionRouteMap points={excursion.points ?? []} />
          </div>
        </div>
      </div>
    </section>
  );
};
