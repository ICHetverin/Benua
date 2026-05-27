import { useState, useRef, useEffect } from "react";
import { petersburgCemeteriesData } from "../model/petersburgCemeteriesData";
import { worldCemeteriesData }      from "../model/worldCemeteriesData";
import { getBurials }               from "shared/api/benuaApi";
import { PetersburgView } from "./components/PetersburgView/PetersburgView";
import { CityAccordion }  from "./components/CityAccordion/CityAccordion";
import { PageInfo }       from "./components/PageInfo/PageInfo";
import { RussiaMap }      from "./components/RussiaMap/RussiaMap";
import { WorldMap }       from "./components/WorldMap/WorldMap";
import leftArrow  from "shared/assets/icons/left.svg";
import rightArrow from "shared/assets/icons/right.svg";
import styles from "./Cemeteries.module.css";

function groupBurialsToRussiaData(burials) {
  const cityMap = new Map();
  for (const b of burials) {
    if (!cityMap.has(b.city)) {
      cityMap.set(b.city, { id: b.city.toLowerCase().replace(/\s+/g, "-"), city: b.city, cemeteries: new Map() });
    }
    const cityEntry = cityMap.get(b.city);
    const cemeteryKey = b.cemetery_name ?? null;
    if (!cityEntry.cemeteries.has(cemeteryKey)) {
      cityEntry.cemeteries.set(cemeteryKey, { name: cemeteryKey, persons: [] });
    }
    cityEntry.cemeteries.get(cemeteryKey).persons.push({
      name: b.name,
      dates: b.life_years ?? null,
      description: b.brief_info ?? "",
      personId: b.connected_person_id ?? null,
    });
  }
  return Array.from(cityMap.values()).map((c) => ({
    ...c,
    cemeteries: Array.from(c.cemeteries.values()),
  }));
}

const VIEWS = [
  { key: "peterburg", label: "ПЕТЕРБУРГЕ", layout: "peterburg" },
  { key: "russia",    label: "РОССИИ",    layout: "cities" },
  { key: "world",     label: "МИРЕ",       layout: "cities" },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0);
  const [russiaData, setRussiaData] = useState([]);

  useEffect(() => {
    getBurials().then((data) => setRussiaData(groupBurialsToRussiaData(data))).catch(() => {});
  }, []);
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

  const { label, layout, key: viewKey } = VIEWS[viewIndex];
  const currentData =
    viewKey === "russia"    ? russiaData :
    viewKey === "world"     ? worldCemeteriesData :
    petersburgCemeteriesData;

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
        <PetersburgView cemeteries={currentData} />
      ) : (
        <>
          {viewKey === "russia" && <RussiaMap />}
          {viewKey === "world"  && <WorldMap />}

          <div className={styles.citiesList}>
            {currentData.map((cityData) => (
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
