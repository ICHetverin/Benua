import { useState, useRef } from "react";
import { petersburgCemeteriesData } from "../model/petersburgCemeteriesData";
import { cemeteriesData }           from "../model/cemeteriesData";
import { worldCemeteriesData }      from "../model/worldCemeteriesData";
import { PetersburgView } from "./components/PetersburgView/PetersburgView";
import { CityAccordion }  from "./components/CityAccordion/CityAccordion";
import { PageInfo }       from "./components/PageInfo/PageInfo";
import leftArrow  from "shared/assets/icons/left.svg";
import rightArrow from "shared/assets/icons/right.svg";
import styles from "./Cemeteries.module.css";

const VIEWS = [
  { key: "peterburg", label: "ПЕТЕРБУРГ", layout: "peterburg", data: petersburgCemeteriesData },
  { key: "russia",    label: "РОССИЯ",    layout: "cities",    data: cemeteriesData },
  { key: "world",     label: "МИР",       layout: "cities",    data: worldCemeteriesData },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0);
  // "left" | "right" | null — направление последней анимации
  const [slideDir, setSlideDir] = useState(null);
  const animTimeout = useRef(null);

  const navigate = (dir) => {
    // dir: +1 = вперёд (вправо→влево), -1 = назад (влево→вправо)
    if (animTimeout.current) clearTimeout(animTimeout.current);
    setSlideDir(dir > 0 ? "right" : "left");
    // Даём CSS-классу появиться, затем меняем контент
    animTimeout.current = setTimeout(() => {
      setViewIndex((i) => (i + dir + VIEWS.length) % VIEWS.length);
      setSlideDir(null);
    }, 260);
  };

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
              onClick={() => navigate(-1)}
              aria-label="Предыдущий вид"
            >
              <img src={leftArrow} alt="←" width={36} height={36} />
            </button>

            {/* Контейнер с overflow:hidden для анимации */}
            <span className={styles.labelWrap}>
              <span
                className={`${styles.titleHighlight} ${
                  slideDir === "right" ? styles.slideOutLeft  :
                  slideDir === "left"  ? styles.slideOutRight : ""
                }`}
              >
                {label}
              </span>
            </span>

            <button
              className={styles.arrowBtn}
              onClick={() => navigate(+1)}
              aria-label="Следующий вид"
            >
              <img src={rightArrow} alt="→" width={36} height={36} />
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
