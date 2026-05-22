import { useState, useRef, useEffect } from "react";
import styles from "./CategoryDropdown.module.css";

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

export const CategoryDropdown = ({ categories, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = categories.find((c) => c.value === selectedValue) ?? categories[0];
  const others = categories.filter((c) => c.value !== selected.value);

  // Закрывать при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <p className={styles.label}>Выбрать категорию:</p>

      <div className={`${styles.dropdown} ${isOpen ? styles.dropdownOpen : ""}`}>
        {/* Активный/выбранный элемент — всегда вверху */}
        <button
          className={`${styles.dropdownHeader} ${isOpen ? styles.dropdownHeaderOpen : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selected.label}</span>
          {isOpen ? (
            <ChevronUp className={styles.chevron} />
          ) : (
            <ChevronDown className={styles.chevron} />
          )}
        </button>

        {/* Список остальных категорий */}
        {isOpen && (
          <ul className={styles.dropdownList} role="listbox">
            {others.map((cat) => (
              <li key={cat.value} role="option" aria-selected={false}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(cat.value)}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
