import { useState } from "react";
import { BurialPersonCard } from "../BurialPersonCard/BurialPersonCard";
import styles from "./CityAccordion.module.css";

export function CityAccordion({ cityData, isHighlighted }) {
  const [isOpen, setIsOpen] = useState(true);

  const totalPersons = cityData.cemeteries.reduce(
    (sum, c) => sum + c.persons.length,
    0,
  );

  return (
    <section
      className={`${styles.section} ${isHighlighted ? styles.highlighted : ""}`}
      id={`city-${cityData.id}`}
    >
      {/* Заголовок города */}
      <button
        className={styles.header}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={`content-${cityData.id}`}
      >
        <h2 className={styles.cityName}>{cityData.city.toUpperCase()}</h2>
        <span
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* Контент */}
      <div
        id={`content-${cityData.id}`}
        className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}
      >
        <div className={styles.inner}>
          {cityData.cemeteries.map((cemetery, cIdx) => (
            <div key={cIdx} className={styles.cemeteryBlock}>
              {/* Название кладбища (если есть) */}
              {cemetery.name && (
                <h3 className={styles.cemeteryName}>{cemetery.name}</h3>
              )}

              {/* Персоналии */}
              <div
                className={`${styles.personsGrid} ${
                  !cemetery.name && cityData.cemeteries.length === 1
                    ? styles.personsGridFull
                    : ""
                }`}
              >
                {cemetery.persons.map((person, pIdx) => (
                  <BurialPersonCard key={pIdx} person={person} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
