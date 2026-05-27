import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./TextSection.module.css";

/**
 * Универсальный текстовый блок.
 * Если строки контента начинаются с «→» — рендерится как список со стрелками.
 * Иначе — как параграф.
 */
const renderContent = (content) => {
  if (!content) return null;

  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const hasArrows = lines.some((l) => l.startsWith("→"));

  if (hasArrows) {
    return (
      <ul className={styles.arrowList}>
        {lines.map((line, i) => {
          const text = line.startsWith("→") ? line.slice(1).trim() : line;
          return (
            <li key={i} className={styles.arrowItem}>
              <ArrowIcon className={styles.arrow} width={14} height={14} />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return <p className={styles.paragraph}>{content}</p>;
};

export const TextSection = ({ title, content }) => {
  if (!content) return null;

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title?.toUpperCase()}</h3>
      {renderContent(content)}
    </section>
  );
};
