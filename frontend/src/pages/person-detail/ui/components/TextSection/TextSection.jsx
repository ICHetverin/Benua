import styles from './TextSection.module.css';

export const TextSection = ({ title, content }) => {
  if (!content) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.paragraph}>{content}</p>
    </section>
  );
};
