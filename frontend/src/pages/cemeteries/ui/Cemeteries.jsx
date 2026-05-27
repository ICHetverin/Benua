import { useState, useRef, useCallback } from "react";
import { petersburgCemeteriesData } from "../model/petersburgCemeteriesData";
import { cemeteriesData }           from "../model/cemeteriesData";
import { worldCemeteriesData }      from "../model/worldCemeteriesData";
import { PetersburgView } from "./components/PetersburgView/PetersburgView";
import { CityAccordion }  from "./components/CityAccordion/CityAccordion";
import { PageInfo }       from "./components/PageInfo/PageInfo";
import { RussiaMap }      from "./components/RussiaMap/RussiaMap";
import leftArrow  from "shared/assets/icons/left.svg";
import rightArrow from "shared/assets/icons/right.svg";
import styles from "./Cemeteries.module.css";

const VIEWS = [
  { key: "peterburg", label: "ПЕТЕРБУРГЕ", layout: "peterburg", data: petersburgCemeteriesData },
  { key: "russia",    label: "РОССИИ",    layout: "cities",    data: cemeteriesData },
  { key: "world",     label: "МИРЕ",       layout: "cities",    data: worldCemeteriesData },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0);
  // exitDir  — направление выхода  текущего слова: "toLeft" | "toRight" | null
  // enterDir — направление входа   нового слова:   "fromRight" | "fromLeft" | null
  const [exitDir,  setExitDir]  = useState(null);
  const [enterDir, setEnterDir] = useState(null);
  const t1 = useRef(null);
  const t2 = useRef(null);

  const navigate = (dir) => {
    // Блокируем повторный клик во время анимации
    if (exitDir || enterDir) return;

    const nextIndex  = (viewIndex + dir + VIEWS.length) % VIEWS.length;
    // dir > 0 (→): старое уходит влево, новое приходит справа
    // dir < 0 (←): старое уходит вправо, новое приходит слева
    const exitTo  = dir > 0 ? "toLeft"    : "toRight";
    const enterFrom = dir > 0 ? "fromRight" : "fromLeft";

    clearTimeout(t1.current);
    clearTimeout(t2.current);

    setExitDir(exitTo);

    t1.current = setTimeout(() => {
      setViewIndex(nextIndex);
      setExitDir(null);
      setEnterDir(enterFrom);

      t2.current = setTimeout(() => setEnterDir(null), 280);
    }, 240);
  };

  const { label, layout, data, key: viewKey } = VIEWS[viewIndex];

  /* Скролл к городу при клике на маркер карты */
  const scrollToCity = useCallback((cityId) => {
    const el = document.getElementById(`city-${cityId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
                  exitDir  === "toLeft"    ? styles.slideOutLeft    :
                  exitDir  === "toRight"   ? styles.slideOutRight   :
                  enterDir === "fromRight" ? styles.slideInFromRight :
                  enterDir === "fromLeft"  ? styles.slideInFromLeft  : ""
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
        <>
          {/* Карта России — только для вида "россия" */}
          {viewKey === "russia" && (
            <RussiaMap cities={data} onCityClick={scrollToCity} />
          )}

          <div className={styles.citiesList}>
            {data.map((cityData) => (
              <CityAccordion
                key={cityData.id}
                cityData={cityData}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Информация внизу ── */}
      <PageInfo />
    </div>
  );
}
