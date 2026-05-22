import { ObjectCatalogCard } from "../ObjectCatalogCard/ObjectCatalogCard";
import styles from "./BuildingAccordion.module.css";

const ChevronDown = ({ className }) => (
  <svg viewBox="0 0 12 8" fill="none" className={className}>
    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUp = ({ className }) => (
  <svg viewBox="0 0 12 8" fill="none" className={className}>
    <path d="M11 7L6 2 1 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BuildingAccordion = ({ label, buildings = [], isOpen, onToggle }) => {
  return (
    <div className={styles.section}>
      <button
        className={styles.header}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.headerLabel}>{label.toUpperCase()}</span>
        {isOpen ? (
          <ChevronUp className={styles.chevron} />
        ) : (
          <ChevronDown className={styles.chevron} />
        )}
      </button>

      {isOpen && buildings.length > 0 && (
        <div className={styles.grid}>
          {buildings.map((obj) => (
            <ObjectCatalogCard key={obj._id} object={obj} />
          ))}
        </div>
      )}

      {isOpen && buildings.length === 0 && (
        <p className={styles.empty}>Объекты в этой категории пока не добавлены.</p>
      )}
    </div>
  );
};
