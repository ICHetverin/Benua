import styles from './SourcesList.module.css';

export const SourcesList = ({ sources = [] }) => {
  if (!sources.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Источники и материалы</h2>
        <ul className={styles.list}>
          {sources.map((src) => (
            <li key={src._id ?? src.url} className={styles.item}>
              <span className={styles.arrow}>→</span>
              {src.url ? (
                <a
                  href={src.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {src.text}
                </a>
              ) : (
                <span className={styles.text}>{src.text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
