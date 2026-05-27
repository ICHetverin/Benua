import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useYmaps } from 'shared/lib/ymaps';
import { useObjects } from 'entities/object';
import styles from './YandexMap.module.css';

const SPB_CENTER = [59.939, 30.315];
const MAP_ZOOM = 12;

/** Строит HTML-контент баллона для конкретного объекта */
function buildBalloonContent(id, name) {
  return `
    <div style="
      font-family: 'Lora', Georgia, serif;
      text-align: center;
      padding: 12px 14px;
      max-width: 230px;
      box-sizing: border-box;
    ">
      <p style="
        font-size: 14px;
        font-weight: 600;
        margin: 0 0 12px;
        color: #231C07;
        line-height: 1.4;
      ">${name}</p>
      <a
        href="/objects/${id}"
        style="
          display: inline-block;
          padding: 7px 18px;
          background-color: #8A3033;
          color: #FAF3E7;
          border-radius: 4px;
          text-decoration: none;
          font-size: 13px;
          font-family: 'Lora', Georgia, serif;
          letter-spacing: 0.03em;
          transition: opacity 0.2s;
        "
      >Перейти к объекту</a>
    </div>
  `;
}

/**
 * Создаёт кастомный layout иконки — пин в цвете проекта.
 * Создаётся один раз и переиспользуется для всех меток.
 */
function createPinLayout(ymaps) {
  return ymaps.templateLayoutFactory.createClass(`
    <div style="
      display: inline-block;
      transform: translate(-50%, -100%);
      filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));
      cursor: pointer;
    ">
      <img
        src="/map_marker.svg"
        width="46"
        height="47"
        style="
          display: block;
          filter: brightness(0) saturate(100%) invert(22%) sepia(60%) saturate(600%) hue-rotate(315deg) brightness(90%) contrast(100%);
        "
        alt=""
      />
    </div>
  `);
}

export function YandexMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  const ymaps = useYmaps();
  const { data, isLoading, isError } = useObjects();

  /** Только объекты с заданными координатами */
  const geoObjects = useMemo(() => {
    const all = Array.isArray(data) ? data : (data?.data ?? []);
    return all.filter(
      (b) => b.latitude != null && b.longitude != null
    );
  }, [data]);

  /** Инициализируем карту однократно, когда ymaps готов */
  useEffect(() => {
    if (!ymaps || !containerRef.current) return;

    const map = new ymaps.Map(
      containerRef.current,
      {
        center: SPB_CENTER,
        zoom: MAP_ZOOM,
        controls: ['zoomControl', 'fullscreenControl'],
      },
      { suppressMapOpenBlock: true }
    );

    mapRef.current = map;

    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, [ymaps]);

  /** Обновляем метки при изменении данных или готовности ymaps */
  useEffect(() => {
    const map = mapRef.current;
    if (!ymaps || !map) return;

    map.geoObjects.removeAll();

    if (geoObjects.length === 0) return;

    const PinLayout = createPinLayout(ymaps);

    geoObjects.forEach(({ _id, name, latitude, longitude }) => {
      const placemark = new ymaps.Placemark(
        [latitude, longitude],
        {
          balloonContent: buildBalloonContent(_id, name),
        },
        {
          iconLayout: PinLayout,
          iconShape: {
            type: 'Circle',
            coordinates: [0, -24], // центр пина (смещение для drop-shadow)
            radius: 23,
          },
          balloonCloseButton: true,
          hideIconOnBalloonOpen: false,
        }
      );

      map.geoObjects.add(placemark);
    });
  }, [ymaps, geoObjects]);

  return (
    <div className={styles.wrapper}>
      {isLoading && (
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Загрузка объектов…</span>
        </div>
      )}
      {isError && (
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Не удалось загрузить объекты</span>
        </div>
      )}
      {!ymaps && !isError && (
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Инициализация карты…</span>
        </div>
      )}
      <div ref={containerRef} className={styles.map} />
    </div>
  );
}
