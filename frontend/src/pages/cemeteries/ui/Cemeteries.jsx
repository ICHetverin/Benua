import { cemeteriesData } from "../model/cemeteriesData";
import { CityAccordion } from "./components/CityAccordion/CityAccordion";
import { PageInfo } from "./components/PageInfo/PageInfo";
import styles from "./Cemeteries.module.css";

export function Cemeteries() {
  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>МЕСТА ЗАХОРОНЕНИЯ В</span>
          <span className={styles.titleHighlight}>
            <span className={styles.arrow} aria-hidden="true">◁</span>
            РОССИЯ
            <span className={styles.arrow} aria-hidden="true">▷</span>
          </span>
        </h1>
      </header>

      {/* Список городов */}
      <div className={styles.citiesList}>
        {cemeteriesData.map((cityData) => (
          <CityAccordion key={cityData.id} cityData={cityData} />
        ))}
      </div>

      {/* Информация внизу */}
      <PageInfo />
    </div>
  );
}
