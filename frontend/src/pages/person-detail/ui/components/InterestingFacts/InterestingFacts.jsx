import styles from './InterestingFacts.module.css';

export const InterestingFacts = ({ facts = [] }) => {
  if (!facts.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Интересные факты</h2>
        <div className={styles.grid}>
          {facts.map((fact, idx) => (
            <div key={idx} className={styles.card}>
              <span className={styles.number}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className={styles.divider} />
              <p className={styles.text}>{fact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
