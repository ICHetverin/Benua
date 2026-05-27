import { useState } from "react";
import styles from "./RussiaMap.module.css";

/**
 * Конвертация географических координат в SVG-координаты.
 * viewBox: "0 0 980 500"
 * Россия охватывает примерно 20°E..190°E по долготе и 41°N..77°N по широте.
 */
const LON_MIN = 20;
const LON_RANGE = 170; // 20E → 190E
const LAT_MAX = 77;
const LAT_RANGE = 36; // 77N → 41N
const SVG_W = 980;
const SVG_H = 500;

function geoToSvg(lat, lon) {
  const x = ((lon - LON_MIN) / LON_RANGE) * SVG_W;
  const y = ((LAT_MAX - lat) / LAT_RANGE) * SVG_H;
  return { x, y };
}

/**
 * Упрощённый контур России (полигон по ключевым точкам, по часовой стрелке).
 * Координаты — SVG-пространство (980×500).
 */
const RUSSIA_POLYGON = [
  // Северо-запад: Финляндия → Карелия
  [46, 165], [42, 175], [38, 190], [35, 218],
  // Балтика / Псков / Эстония
  [28, 265], [25, 295], [30, 320], [55, 335],
  // Центр-запад (Беларусь)
  [68, 348], [82, 365],
  // Украина / Ростов
  [95, 418], [115, 450], [140, 465],
  // Кавказ / Каспий
  [158, 472], [175, 460], [188, 435], [195, 418],
  // Казахстан (степи)
  [228, 380], [270, 368], [310, 362], [348, 368],
  // Алтай
  [395, 378], [430, 370],
  // Монголия / Китай
  [462, 368], [502, 362], [542, 375], [570, 378],
  // Амур / Маньчжурия
  [608, 358], [628, 345], [638, 328],
  // Хабаровск / Приморье
  [658, 400], [665, 472], [640, 480], [622, 465],
  // Японское море
  [680, 440], [700, 390], [720, 360],
  // Сахалин / Курилы (уходим на северо-восток)
  [755, 310], [790, 280], [815, 265],
  // Охотское море
  [840, 250], [870, 248], [900, 240],
  // Чукотка
  [965, 155], [960, 130],
  // Арктика (восток → запад)
  [900, 95], [830, 68],
  // Колыма / Магадан
  [780, 72], [720, 58],
  // Якутия / Таймыр
  [640, 50], [560, 50],
  // Ямал
  [468, 55], [388, 60],
  // Белое море / Кола
  [270, 80], [210, 68],
  // Кольский полуостров
  [155, 88], [120, 118],
  // Мурманск → Финляндия
  [85, 140], [65, 148], [46, 165],
].map(([x, y]) => `${x},${y}`).join(" ");

export function RussiaMap({ cities, activeCity, onCityHover, onCityClick }) {
  const [tooltip, setTooltip] = useState(null);

  const handleMarkerEnter = (city, svgCoords) => {
    setTooltip({ name: city.city, ...svgCoords });
    if (onCityHover) onCityHover(city.id);
  };

  const handleMarkerLeave = () => {
    setTooltip(null);
    if (onCityHover) onCityHover(null);
  };

  const handleMarkerClick = (city) => {
    if (onCityClick) onCityClick(city.id);
  };

  return (
    <div className={styles.mapWrapper}>
      <svg
        className={styles.svg}
        viewBox="0 0 980 500"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Карта России с местами захоронений"
      >
        {/* Фон */}
        <rect width="980" height="500" fill="transparent" />

        {/* Контур России */}
        <polygon
          points={RUSSIA_POLYGON}
          className={styles.russiaShape}
        />

        {/* Маркеры городов */}
        {cities.map((city) => {
          const { x, y } = geoToSvg(city.lat, city.lon);
          const isActive = activeCity === city.id;

          return (
            <g
              key={city.id}
              className={styles.markerGroup}
              onMouseEnter={() => handleMarkerEnter(city, { x, y })}
              onMouseLeave={handleMarkerLeave}
              onClick={() => handleMarkerClick(city)}
              role="button"
              aria-label={city.city}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleMarkerClick(city);
              }}
            >
              {/* Ореол */}
              <ellipse
                cx={x}
                cy={y}
                rx={isActive ? 28 : 22}
                ry={isActive ? 20 : 16}
                className={isActive ? styles.markerGlowActive : styles.markerGlow}
              />
              {/* Основная метка */}
              <ellipse
                cx={x}
                cy={y}
                rx={isActive ? 18 : 14}
                ry={isActive ? 13 : 10}
                className={isActive ? styles.markerActive : styles.marker}
              />
            </g>
          );
        })}

        {/* Тултип / подпись при наведении */}
        {tooltip && (
          <g className={styles.tooltip}>
            <rect
              x={tooltip.x + 12}
              y={tooltip.y - 18}
              width={tooltip.name.length * 9 + 16}
              height={24}
              rx={4}
              className={styles.tooltipBg}
            />
            <text
              x={tooltip.x + 20}
              y={tooltip.y - 2}
              className={styles.tooltipText}
            >
              {tooltip.name}
            </text>
          </g>
        )}

        {/* Постоянная подпись Иркутск (как на макете) */}
        {cities
          .filter((c) => c.id === "irkutsk")
          .map((city) => {
            const { x, y } = geoToSvg(city.lat, city.lon);
            return (
              <text
                key="irkutsk-label"
                x={x + 4}
                y={y - 18}
                className={styles.cityLabel}
              >
                ИРКУТСК
              </text>
            );
          })}
        {cities
          .filter((c) => c.id === "irkutsk")
          .map((city) => {
            const { x, y } = geoToSvg(city.lat, city.lon);
            return (
              <text
                key="irkutsk-count"
                x={x + 4}
                y={y - 6}
                className={styles.cityLabelSub}
              >
                1 персона
              </text>
            );
          })}
      </svg>
    </div>
  );
}
