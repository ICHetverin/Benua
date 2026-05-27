import { useState } from "react";
import { petersburgCemeteriesData } from "../model/petersburgCemeteriesData";
import { cemeteriesData }           from "../model/cemeteriesData";
import { worldCemeteriesData }      from "../model/worldCemeteriesData";
import { PetersburgView } from "./components/PetersburgView/PetersburgView";
import { CityAccordion }  from "./components/CityAccordion/CityAccordion";
import { PageInfo }       from "./components/PageInfo/PageInfo";
import styles from "./Cemeteries.module.css";

/**
 * Порядок видов (зациклен): ПЕТЕРБУРГ → РОССИЯ → МИР → ПЕТЕРБУРГ
 */
const VIEWS = [
  {
    key:    "peterburg",
    label:  "ПЕТЕРБУРГ",
    layout: "peterburg",
    data:   petersburgCemeteriesData,
  },
  {
    key:    "russia",
    label:  "РОССИЯ",
    layout: "cities",
    data:   cemeteriesData,
  },
  {
    key:    "world",
    label:  "МИР",
    layout: "cities",
    data:   worldCemeteriesData,
  },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0); // 0 = Петербург по умолчанию

  const prev = () => setViewIndex((i) => (i - 1 + VIEWS.length) % VIEWS.length);
  const next = () => setViewIndex((i) => (i + 1) % VIEWS.length);

  const { label, layout, data } = VIEWS[viewIndex];

  return (
    <div className={styles.page}>
      {/* ── Заголовок с переключателем ── */}
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

      {/* ── Контент ── */}
      {layout === "peterburg" ? (
        <PetersburgView cemeteries={data} />
      ) : (
        <div className={styles.citiesList}>
          {data.map((cityData) => (
            <CityAccordion key={cityData.id} cityData={cityData} />
          ))}
        </div>
      )}

      {/* ── Информация внизу ── */}
      <PageInfo />
    </div>
  );
}
