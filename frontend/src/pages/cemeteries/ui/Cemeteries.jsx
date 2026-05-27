import { useState, useRef } from "react";
import { cemeteriesData } from "../model/cemeteriesData";
import { RussiaMap } from "./components/RussiaMap/RussiaMap";
import { CityAccordion } from "./components/CityAccordion/CityAccordion";
import { PageInfo } from "./components/PageInfo/PageInfo";
import styles from "./Cemeteries.module.css";

export function Cemeteries() {
  const [activeCity, setActiveCity] = useState(null);
  const accordionRefs = useRef({});

  // При клике по маркеру на карте → скролл к нужному городу
  const handleCityClick = (cityId) => {
    const el = accordionRefs.current[cityId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <header className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>МЕСТА ЗАХОРОНЕНИЯ В</span>
            <span className={styles.titleHighlight}>
              <span className={styles.arrow} aria-hidden="true">◁</span>
              РОССИЯ
              <span className={styles.arrow} aria-hidden="true">▷</span>
            </span>
          </h1>
        </div>
      </header>

      {/* Карта */}
      <RussiaMap
        cities={cemeteriesData}
        activeCity={activeCity}
        onCityHover={setActiveCity}
        onCityClick={handleCityClick}
      />

      {/* Список городов */}
      <div className={styles.citiesList}>
        {cemeteriesData.map((cityData) => (
          <div
            key={cityData.id}
            ref={(el) => {
              accordionRefs.current[cityData.id] = el;
            }}
          >
            <CityAccordion
              cityData={cityData}
              isHighlighted={activeCity === cityData.id}
            />
          </div>
        ))}
      </div>

      {/* Информация внизу */}
      <PageInfo />
    </div>
  );
}
