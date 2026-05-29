import { useEffect, useRef, useMemo } from "react";
import { useYmaps } from "shared/lib/ymaps";
import styles from "./ExcursionRouteMap.module.css";

const COLOR_FIRST = "#2E7D32";
const COLOR_LAST  = "#8A3033";
const COLOR_MID   = "#001F53";
const LINE_COLOR  = "#001F53";

function pinColor(index, total) {
  if (index === 0)          return COLOR_FIRST;
  if (index === total - 1)  return COLOR_LAST;
  return COLOR_MID;
}

function createPinLayout(ymaps, number, color) {
  return ymaps.templateLayoutFactory.createClass(`
    <div style="
      display:inline-block;
      transform:translate(-50%,-100%);
      filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));
    ">
      <div style="
        width:30px;height:30px;
        background-color:${color};
        border-radius:50%;
        border:2px solid rgba(255,255,255,.9);
        display:flex;align-items:center;justify-content:center;
        font-family:'Lora',Georgia,serif;
        font-size:12px;font-weight:700;color:#fff;
        line-height:1;box-sizing:border-box;
      ">${number}</div>
    </div>
  `);
}

export function ExcursionRouteMap({ points = [] }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const ymaps        = useYmaps();

  const geoPoints = useMemo(
    () => points.filter((p) => p.lat != null && p.lng != null),
    [points]
  );

  useEffect(() => {
    if (!ymaps || !containerRef.current || geoPoints.length === 0) return;

    const map = new ymaps.Map(
      containerRef.current,
      {
        center: [geoPoints[0].lat, geoPoints[0].lng],
        zoom: 13,
        controls: ["zoomControl", "fullscreenControl"],
      },
      { suppressMapOpenBlock: true }
    );
    mapRef.current = map;

    geoPoints.forEach((point, idx) => {
      const PinLayout = createPinLayout(ymaps, idx + 1, pinColor(idx, geoPoints.length));
      const placemark = new ymaps.Placemark(
        [point.lat, point.lng],
        {
          hintContent: point.address,
          balloonContent: `
            <span style="
              font-family:'Lora',Georgia,serif;
              font-size:14px;font-weight:600;color:#231C07;
            ">${idx + 1}. ${point.address}</span>
          `,
        },
        {
          iconLayout: PinLayout,
          iconShape: { type: "Circle", coordinates: [0, -15], radius: 15 },
          balloonCloseButton: true,
          hideIconOnBalloonOpen: false,
        }
      );
      map.geoObjects.add(placemark);
    });

    if (geoPoints.length > 1) {
      map.geoObjects.add(
        new ymaps.Polyline(
          geoPoints.map((p) => [p.lat, p.lng]),
          {},
          { strokeColor: LINE_COLOR, strokeWidth: 3, strokeOpacity: 0.6 }
        )
      );
    }

    if (geoPoints.length === 1) {
      map.setCenter([geoPoints[0].lat, geoPoints[0].lng], 15);
    } else {
      map.setBounds(map.geoObjects.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 40,
      });
    }

    return () => {
      map.destroy();
      mapRef.current = null;
    };
  }, [ymaps, geoPoints]);

  if (geoPoints.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Карта маршрута</h2>
        <div className={styles.mapWrapper}>
          {!ymaps && (
            <div className={styles.overlay}>
              <span className={styles.overlayText}>Инициализация карты…</span>
            </div>
          )}
          <div ref={containerRef} className={styles.map} />
        </div>
      </div>
    </section>
  );
}
