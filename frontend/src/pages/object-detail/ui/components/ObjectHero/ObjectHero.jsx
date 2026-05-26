import styles from "./ObjectHero.module.css";

const CalendarIcon = () => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={styles.metaIcon}>
    <path d="M5 1v2H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2V1h-2v2H7V1H5zm-2 6h12v9H3V7z" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 14 18" fill="currentColor" className={styles.metaIcon}>
    <path d="M7 0C4.24 0 2 2.24 2 5c0 3.75 5 13 5 13s5-9.25 5-13c0-2.76-2.24-5-5-5zm0 7.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 18 18" fill="currentColor" className={styles.metaIcon}>
    <path d="M9 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.87 0-7 1.57-7 3.5V16h14v-1.5c0-1.93-3.13-3.5-7-3.5z" />
  </svg>
);

export const ObjectHero = ({ object }) => {
  const coverImage =
    (object.featured_image_id &&
      object.images?.find((img) => img._id === object.featured_image_id)) ||
    object.images?.[0];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <p className={styles.breadcrumb}>( Объекты )</p>
        <h1 className={styles.title}>{object.name?.toUpperCase()}</h1>

        <div className={styles.contentGrid}>
          {/* ── Image ── */}
          <div className={styles.imageCol}>
            {coverImage ? (
              <img
                src={coverImage.url_to_s3}
                alt={coverImage.text ?? object.name}
                className={styles.image}
                loading="eager"
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>

          {/* ── Meta ── */}
          <div className={styles.metaCol}>
            {object.years_built && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <CalendarIcon />
                  <span>Год постройки</span>
                </div>
                <p className={styles.metaValue}>{object.years_built}</p>
              </div>
            )}

            {object.address && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <PinIcon />
                  <span>Местоположение</span>
                </div>
                <p className={styles.metaValue}>{object.address}</p>
              </div>
            )}

            {object.architect && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <PersonIcon />
                  <span>Архитекторы</span>
                </div>
                <p className={styles.metaValue}>{object.architect}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
