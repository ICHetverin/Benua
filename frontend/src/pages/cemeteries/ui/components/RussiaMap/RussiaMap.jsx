import { useState, useCallback } from "react";
import styles from "./RussiaMap.module.css";

/* ─── Географическое → SVG-пространство ──────────────────────────────────
 * Карта россия.svg: viewBox="0 0 1296 670"
 * Фактический ареал точек: x=[38.9, 1292.9], y=[48.3, 651.6]
 * Что соответствует географическому диапазону России:
 *   Долгота: 20°E → 190°E  (170°)
 *   Широта:  77°N → 41°N   (36°)
 * ─────────────────────────────────────────────────────────────────────── */
const LON_MIN   = 20;
const LON_RANGE = 170;
const LAT_MAX   = 77;
const LAT_RANGE = 36;
const X_OFFSET  = 38.9;
const Y_OFFSET  = 48.3;
const X_RANGE   = 1254;  // 1292.9 − 38.9
const Y_RANGE   = 603.3; // 651.6  − 48.3

function geoToSvg(lat, lon) {
  const x = X_OFFSET + ((lon - LON_MIN) / LON_RANGE) * X_RANGE;
  const y = Y_OFFSET + ((LAT_MAX - lat) / LAT_RANGE) * Y_RANGE;
  return { x, y };
}

/** Суммирует количество захоронений (персон) в городе */
function countBurials(cityData) {
  return cityData.cemeteries.reduce(
    (sum, cem) => sum + cem.persons.length,
    0
  );
}

/** Русская форма слова "захоронение" */
function burialsLabel(n) {
  const mod10  = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${n} захоронений`;
  if (mod10 === 1) return `${n} захоронение`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} захоронения`;
  return `${n} захоронений`;
}

/* ─── Константы радиусов маркеров ─── */
const R_OUTER_IDLE   = 18;
const R_OUTER_HOVER  = 24;
const R_INNER_IDLE   = 9;
const R_INNER_HOVER  = 12;

export function RussiaMap({ cities, onCityClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleEnter = useCallback((id) => setHoveredId(id), []);
  const handleLeave = useCallback(()   => setHoveredId(null), []);

  return (
    <div className={styles.mapWrapper}>
      {/* ── Фон: карта России ── */}
      <img
        src={`${process.env.PUBLIC_URL}/russia.svg`}
        alt="Карта России"
        className={styles.russiaImg}
        draggable={false}
      />

      {/* ── Интерактивный SVG-слой ── */}
      <svg
        viewBox="0 0 1296 670"
        className={styles.overlay}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Метки захоронений на карте России"
      >
        {cities.map((city) => {
          const { x, y }  = geoToSvg(city.lat, city.lon);
          const count     = countBurials(city);
          const isHovered = hoveredId === city.id;

          return (
            <g
              key={city.id}
              className={styles.markerGroup}
              onMouseEnter={() => handleEnter(city.id)}
              onMouseLeave={handleLeave}
              onClick={() => onCityClick?.(city.id)}
              role="button"
              aria-label={`${city.city}: ${burialsLabel(count)}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onCityClick?.(city.id);
              }}
            >
              {/* Ореол */}
              <ellipse
                cx={x} cy={y}
                rx={isHovered ? R_OUTER_HOVER : R_OUTER_IDLE}
                ry={isHovered ? R_OUTER_HOVER * 0.72 : R_OUTER_IDLE * 0.72}
                className={isHovered ? styles.glowHover : styles.glow}
              />
              {/* Основная точка */}
              <circle
                cx={x} cy={y}
                r={isHovered ? R_INNER_HOVER : R_INNER_IDLE}
                className={isHovered ? styles.dotHover : styles.dot}
              />
            </g>
          );
        })}
      </svg>

      {/* ── Тултип (HTML, для удобства стилизации) ── */}
      {hoveredId && (() => {
        const city  = cities.find((c) => c.id === hoveredId);
        if (!city) return null;
        const { x, y } = geoToSvg(city.lat, city.lon);
        const count     = countBurials(city);
        // x,y в SVG-координатах → % от viewBox
        const leftPct = (x / 1296) * 100;
        const topPct  = (y / 670)  * 100;
        return (
          <div
            className={styles.tooltip}
            style={{
              left: `${leftPct}%`,
              top:  `${topPct}%`,
            }}
          >
            <span className={styles.tooltipCity}>{city.city}</span>
            <span className={styles.tooltipCount}>{burialsLabel(count)}</span>
          </div>
        );
      })()}
    </div>
  );
}
