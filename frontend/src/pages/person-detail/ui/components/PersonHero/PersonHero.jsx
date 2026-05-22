import styles from './PersonHero.module.css';

const BriefcaseIcon = () => (
  <svg viewBox="0 0 18 16" fill="currentColor" className={styles.metaIcon}>
    <path d="M6 0v2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4V0H6zm0 2h6v2H6V2zM2 4h14v10H2V4z" />
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

export const PersonHero = ({ person }) => {
  const coverImage = person.images?.[0];

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <p className={styles.breadcrumb}>( Персоны )</p>
        <h1 className={styles.title}>{person.name}</h1>
        {person.life_years && (
          <p className={styles.lifeYears}>{person.life_years}</p>
        )}

        <div className={styles.contentGrid}>
          <div className={styles.imageCol}>
            {coverImage ? (
              <img
                src={coverImage.url_to_s3}
                alt={coverImage.text ?? person.name}
                className={styles.image}
                loading="eager"
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>

          <div className={styles.metaCol}>
            {person.profession && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <BriefcaseIcon />
                  <span>Профессия</span>
                </div>
                <p className={styles.metaValue}>{person.profession}</p>
              </div>
            )}

            {person.birth_place && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <PinIcon />
                  <span>Место рождения</span>
                </div>
                <p className={styles.metaValue}>{person.birth_place}</p>
              </div>
            )}

            {person.connection_with_benua && (
              <div className={styles.metaItem}>
                <div className={styles.metaLabel}>
                  <PersonIcon />
                  <span>Связь с семьей Бенуа</span>
                </div>
                <p className={styles.metaValue}>{person.connection_with_benua}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
