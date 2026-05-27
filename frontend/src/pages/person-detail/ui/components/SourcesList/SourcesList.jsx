import { ArrowIcon } from 'shared/assets/icons/ArrowIcon';
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
              <ArrowIcon className={styles.arrow} width={12} height={12} />
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
