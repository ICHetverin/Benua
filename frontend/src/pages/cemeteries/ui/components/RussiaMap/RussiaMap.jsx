import { useState, useRef, useEffect, useCallback } from "react";
import { ReactComponent as RussiaSvg } from "shared/assets/images/russia_map.svg";
import { RUSSIA_REGIONS } from "pages/cemeteries/model/russiaRegions";
import styles from "./RussiaMap.module.css";

const HEADER_HEIGHT = 71;

export function RussiaMap({ russiaData = [] }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const regionStats = useRef({});

  useEffect(() => {
    const stats = {};
    for (const cityData of russiaData) {
      const rid = cityData.russiaRegion;
      if (!rid) continue;
      const count = cityData.cemeteries
        ? cityData.cemeteries.reduce((s, c) => s + c.persons.length, 0)
        : 0;
      if (!stats[rid]) stats[rid] = { count: 0, cityId: cityData.id, cityName: cityData.city };
      stats[rid].count += count;
    }
    regionStats.current = stats;
  }, [russiaData]);

  useEffect(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    svg.querySelectorAll("path[data-active]").forEach((p) =>
      p.removeAttribute("data-active")
    );
    for (const rid of Object.keys(regionStats.current)) {
      const el = svg.querySelector(`#${rid}`);
      if (el) el.setAttribute("data-active", "true");
    }
  }, [russiaData]);

  const handleSvgClick = useCallback((e) => {
    const path = e.target.closest("path[data-active]");
    if (!path) {
      setTooltip(null);
      return;
    }
    const rid = path.id;
    const stat = regionStats.current[rid];
    if (!stat) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const pathRect = path.getBoundingClientRect();
    const x = pathRect.left + pathRect.width / 2 - wrapperRect.left;
    const y = pathRect.top + pathRect.height / 2 - wrapperRect.top;

    setTooltip({ rid, cityId: stat.cityId, cityName: stat.cityName, count: stat.count, x, y });
  }, []);

  const handleTooltipClick = useCallback(() => {
    if (!tooltip) return;
    const el = document.getElementById(`city-${tooltip.cityId}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - 16;
    window.scrollTo({ top, behavior: "smooth" });
    setTooltip(null);
  }, [tooltip]);

  return (
    <div className={styles.mapWrapper} ref={wrapperRef}>
      <div ref={svgRef} onClick={handleSvgClick}>
        <RussiaSvg className={styles.russiaImg} />
      </div>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
          onClick={handleTooltipClick}
        >
          <p className={styles.tooltipCity}>{(tooltip.cityName ?? RUSSIA_REGIONS[tooltip.rid] ?? tooltip.rid).toUpperCase()}</p>
          <p className={styles.tooltipCount}>
            {tooltip.count} {plural(tooltip.count, "персона", "персоны", "персон")}
          </p>
        </div>
      )}
    </div>
  );
}

function plural(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
