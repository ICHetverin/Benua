import { useEffect, useRef } from "react";
import { ReactComponent as RussiaSvg } from "shared/assets/images/russia_map.svg";
import styles from "./RussiaMap.module.css";

// Приближённая эквидистантная проекция для russia_map.svg (viewBox 0 0 1296 670)
const LON_MIN = 26, LON_MAX = 192;
const LAT_MAX = 82, LAT_MIN = 41;
const SVG_W   = 1296, SVG_H = 670;

function lonToX(lon) { return (lon - LON_MIN) / (LON_MAX - LON_MIN) * SVG_W; }
function latToY(lat) { return (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * SVG_H; }

// isPointInFill пробует несколько смещений, чтобы компенсировать погрешность проекции
function findRegionPath(svgEl, allPaths, x, y) {
  const offsets = [
    [0, 0],
    [15, 0], [-15, 0], [0, 15], [0, -15],
    [25, 25], [-25, 25], [25, -25], [-25, -25],
  ];
  for (const [dx, dy] of offsets) {
    const pt = svgEl.createSVGPoint();
    pt.x = x + dx;
    pt.y = y + dy;
    for (const path of allPaths) {
      try {
        if (path.isPointInFill(pt)) return path;
      } catch (_) {}
    }
  }
  return null;
}

export function RussiaMap({ cities = [], onCityClick }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const svgEl = wrapperRef.current?.querySelector("svg");
    if (!svgEl || !cities.length) return;

    const allPaths = Array.from(svgEl.querySelectorAll("path[id]"));
    const cleanup = [];

    cities.forEach((city) => {
      if (!city.lat || !city.lon) return;

      const path = findRegionPath(svgEl, allPaths, lonToX(city.lon), latToY(city.lat));
      if (!path) return;

      path.setAttribute("data-city", city.id);

      const handler = () => onCityClick?.(city.id);
      path.addEventListener("click", handler);
      cleanup.push(() => {
        path.removeAttribute("data-city");
        path.removeEventListener("click", handler);
      });
    });

    return () => cleanup.forEach((fn) => fn());
  }, [cities, onCityClick]);

  const badges = cities.filter((c) => c.lat && c.lon);

  return (
    <div className={styles.mapWrapper} ref={wrapperRef}>
      <RussiaSvg className={styles.russiaImg} />
      {badges.map((city) => (
        <button
          key={city.id}
          className={styles.badge}
          style={{
            left: `${((city.lon - LON_MIN) / (LON_MAX - LON_MIN)) * 100}%`,
            top:  `${((LAT_MAX - city.lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
          }}
          onClick={() => onCityClick?.(city.id)}
          aria-label={`${city.city}: ${city.burialCount} захоронений`}
        >
          {city.burialCount}
        </button>
      ))}
    </div>
  );
}
