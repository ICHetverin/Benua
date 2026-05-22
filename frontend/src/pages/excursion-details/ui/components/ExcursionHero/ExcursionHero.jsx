import styles from "./ExcursionHero.module.css";

const MODE_LABELS = {
  PEDESTRIAN: "Пешком",
  BUS: "На автобусе",
  MIXED: "Смешанный",
};

const buildYandexRouteUrl = (waypoints = []) => {
  const sorted = [...waypoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (sorted.length === 0) return "https://yandex.ru/maps/";
  const rtext = sorted.map((wp) => `${wp.lat},${wp.lng}`).join("~");
  return `https://yandex.ru/maps/?rtext=${rtext}&rtt=pd`;
};

export const ExcursionHero = ({ excursion }) => {
  const tags = [
    excursion.mode ? MODE_LABELS[excursion.mode] : null,
    excursion.duration_minutes
      ? `${Math.floor(excursion.duration_minutes / 60)} ч ${excursion.duration_minutes % 60 ? excursion.duration_minutes % 60 + " мин" : ""}`.trim()
      : null,
  ].filter(Boolean);

  const routeUrl = buildYandexRouteUrl(excursion.waypoints);

  const hasWaypoints =
    excursion.waypoints && excursion.waypoints.length >= 2;

  const mapIframeUrl = hasWaypoints
    ? (() => {
        const sorted = [...excursion.waypoints].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        const pts = sorted
          .map((wp) => `${wp.lng},${wp.lat},pm2rdm`)
          .join("~");
        const center = sorted[0];
        return `https://yandex.ru/map-widget/v1/?ll=${center.lng},${center.lat}&z=13&l=map&pt=${pts}`;
      })()
    : null;

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <p className={styles.breadcrumb}>( Экскурсии )</p>
        <h1 className={styles.title}>{excursion.title?.toUpperCase()}</h1>

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

            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              Сохранить маршрут в Яндекс Картах
            </a>
          </div>

          <div className={styles.mapColumn}>
            {mapIframeUrl ? (
              <iframe
                src={mapIframeUrl}
                className={styles.mapIframe}
                title="Карта маршрута"
                allowFullScreen
                loading="lazy"
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                <p className={styles.mapPlaceholderText}>Карта маршрута</p>
                <a
                  href={routeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapPlaceholderLink}
                >
                  Открыть в Яндекс Картах →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
