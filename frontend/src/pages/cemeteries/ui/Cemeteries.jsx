import { useState, useRef, useEffect, useCallback } from "react";
import { getBurials, getPbCemeteries } from "shared/api/benuaApi";
import { PetersburgView } from "./components/PetersburgView/PetersburgView";
import { CityAccordion }  from "./components/CityAccordion/CityAccordion";
import { PageInfo }       from "./components/PageInfo/PageInfo";
import { RussiaMap }      from "./components/RussiaMap/RussiaMap";
import { WorldMap }       from "./components/WorldMap/WorldMap";
import { RUSSIA_CITY_COORDS } from "../model/russiaRegions";
import leftArrow  from "shared/assets/icons/left.svg";
import rightArrow from "shared/assets/icons/right.svg";
import styles from "./Cemeteries.module.css";

/**
 * Группировка плоского списка захоронений (регион RUSSIA или WORLD)
 * в формат { id, city, cemeteries: [{ name, persons[] }] }.
 */
function groupByCityAndCemetery(burials) {
  const cityMap = new Map();
  for (const b of burials) {
    const cityKey = b.city ?? "Неизвестный город";
    if (!cityMap.has(cityKey)) {
      const coords = RUSSIA_CITY_COORDS[cityKey.toLowerCase()] ?? {};
      cityMap.set(cityKey, {
        id: cityKey.toLowerCase().replace(/\s+/g, "-"),
        city: cityKey,
        lat: coords.lat ?? null,
        lon: coords.lon ?? null,
        cemeteries: new Map(),
      });
    }
    const cityEntry = cityMap.get(cityKey);
    const cKey = b.cemetery_name ?? null;
    if (!cityEntry.cemeteries.has(cKey)) {
      cityEntry.cemeteries.set(cKey, { name: cKey, persons: [] });
    }
    cityEntry.cemeteries.get(cKey).persons.push({
      name: b.name,
      dates: b.life_years ?? null,
      photo: b.images?.[0]?.url_to_s3 ?? null,
      description: b.brief_info ?? "",
      personId: b.connected_person_id ?? null,
    });
  }
  return Array.from(cityMap.values()).map((c) => ({
    ...c,
    cemeteries: Array.from(c.cemeteries.values()),
    burialCount: Array.from(c.cemeteries.values()).reduce((s, cem) => s + cem.persons.length, 0),
  }));
}

/**
 * Собираем данные для PetersburgView:
 * cemeteries (с фото и описанием) + бурялы, привязанные к каждому кладбищу.
 */
function buildPetersburgData(pbCemeteries, burials) {
  const pbBurials = burials.filter((b) => b.region === "PETERSBURG");
  return pbCemeteries.map((c) => ({
    id: c._id,
    name: c.name,
    briefInfo: c.brief_info ?? null,
    images: c.images ?? [],
    persons: pbBurials
      .filter((b) => b.cemetery_id === c._id)
      .map((b) => ({
        name: b.name,
        dates: b.life_years ?? null,
        photo: b.images?.[0]?.url_to_s3 ?? null,
        description: b.brief_info ?? "",
        personId: b.connected_person_id ?? null,
      })),
  }));
}

const VIEWS = [
  { key: "peterburg", label: "ПЕТЕРБУРГЕ", layout: "peterburg" },
  { key: "russia",    label: "РОССИИ",    layout: "cities" },
  { key: "world",     label: "МИРЕ",       layout: "cities" },
];

export function Cemeteries() {
  const [viewIndex, setViewIndex] = useState(0);
  const [exitDir,  setExitDir]  = useState(null);
  const [enterDir, setEnterDir] = useState(null);
  const t1 = useRef(null);
  const t2 = useRef(null);

  const [peterData,  setPeterData]  = useState([]);
  const [russiaData, setRussiaData] = useState([]);
  const [worldData,  setWorldData]  = useState([]);

  const [highlightedCity, setHighlightedCity] = useState(null);

  useEffect(() => {
    Promise.all([getBurials(), getPbCemeteries()])
      .then(([burials, pbCemeteries]) => {
        setPeterData(buildPetersburgData(pbCemeteries, burials));
        setRussiaData(groupByCityAndCemetery(burials.filter((b) => (b.region ?? "RUSSIA") === "RUSSIA")));
        setWorldData(groupByCityAndCemetery(burials.filter((b) => b.region === "WORLD")));
      })
      .catch(() => {});
  }, []);

  const handleCityClick = useCallback((cityId) => {
    setHighlightedCity(cityId);
    const el = document.getElementById(`city-${cityId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => setHighlightedCity(null), 2500);
  }, []);

  const navigate = (dir) => {
    if (exitDir || enterDir) return;
    const nextIndex  = (viewIndex + dir + VIEWS.length) % VIEWS.length;
    const exitTo     = dir > 0 ? "toLeft"    : "toRight";
    const enterFrom  = dir > 0 ? "fromRight" : "fromLeft";
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
    viewKey === "peterburg" ? peterData :
    viewKey === "russia"    ? russiaData : worldData;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.title}>
          <span className={styles.titleMain}>МЕСТА ЗАХОРОНЕНИЯ В</span>
          <span className={styles.titleToggle}>
            <button className={styles.arrowBtn} onClick={() => navigate(-1)} aria-label="Предыдущий вид">
              <img src={leftArrow} alt="←" width={36} height={36} />
            </button>
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
            <button className={styles.arrowBtn} onClick={() => navigate(+1)} aria-label="Следующий вид">
              <img src={rightArrow} alt="→" width={36} height={36} />
            </button>
          </span>
        </h1>
      </header>

      {layout === "peterburg" ? (
        <PetersburgView cemeteries={currentData} />
      ) : (
        <>
          {viewKey === "russia" && (
            <RussiaMap cities={russiaData} onCityClick={handleCityClick} />
          )}
          {viewKey === "world"  && <WorldMap />}
          <div className={styles.citiesList}>
            {currentData.map((cityData) => (
              <CityAccordion
                key={cityData.id}
                cityData={cityData}
                isHighlighted={cityData.id === highlightedCity}
              />
            ))}
          </div>
        </>
      )}

      <PageInfo />
    </div>
  );
}
