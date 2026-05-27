import { useState } from "react";
import { cemeteriesData } from "../model/cemeteriesData";
import { worldCemeteriesData } from "../model/worldCemeteriesData";
import { CityAccordion } from "./components/CityAccordion/CityAccordion";
import { PageInfo } from "./components/PageInfo/PageInfo";
import styles from "./Cemeteries.module.css";

const VIEWS = [
  { key: "russia", label: "РОССИЯ", data: cemeteriesData },
  { key: "world",  label: "МИР",    data: worldCemeteriesData },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0);

  const prev = () =>
    setViewIndex((i) => (i - 1 + VIEWS.length) % VIEWS.length);
  const next = () =>
    setViewIndex((i) => (i + 1) % VIEWS.length);

  const { label, data } = VIEWS[viewIndex];

  return (
    <div className={styles.page}>
      {/* Заголовок с переключателем */}
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>МЕСТА ЗАХОРОНЕНИЯ В</span>

          <span className={styles.titleToggle}>
            <button
              className={styles.arrowBtn}
              onClick={prev}
              aria-label="Предыдущий вид"
            >
              ◁
            </button>

            <span className={styles.titleHighlight}>{label}</span>

            <button
              className={styles.arrowBtn}
              onClick={next}
              aria-label="Следующий вид"
            >
              ▷
            </button>
          </span>
        </h1>
      </header>

      {/* Список городов / стран */}
      <div className={styles.citiesList}>
        {data.map((cityData) => (
          <CityAccordion key={cityData.id} cityData={cityData} />
        ))}
      </div>

      {/* Информация внизу */}
      <PageInfo />
    </div>
  );
}
