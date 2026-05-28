import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./ExcursionRoute.module.css";

/* ── Photo gallery for a single stop ──────────────── */
const PhotoGallery = ({ urls = [] }) => {
  const [idx, setIdx] = useState(0);

  if (urls.length === 0) return <div className={styles.photoPlaceholder} />;

  const prev = () => setIdx((i) => (i - 1 + urls.length) % urls.length);
  const next = () => setIdx((i) => (i + 1) % urls.length);

  return (
    <div className={styles.gallery}>
      <div className={styles.photoWrapper}>
        <img
          key={urls[idx]}
          src={urls[idx]}
          alt=""
          className={styles.photo}
          loading="lazy"
          data-no-lightbox="true"
        />
      </div>
      {urls.length > 1 && (
        <div className={styles.galleryControls}>
          <button className={styles.galleryArrow} onClick={prev} aria-label="Предыдущее фото">
            <ArrowIcon width={14} height={14} style={{ transform: "rotate(180deg)" }} />
          </button>
          <span className={styles.galleryCounter}>{idx + 1} / {urls.length}</span>
          <button className={styles.galleryArrow} onClick={next} aria-label="Следующее фото">
            <ArrowIcon width={14} height={14} />
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Stop content ──────────────────────────────────── */
const StopContent = ({ point }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.stopContent}>
      <div className={styles.photoColumn}>
        <PhotoGallery urls={point.photo_urls ?? []} />
      </div>

      <div className={styles.textColumn}>
        {point.description && (
          <p className={styles.descriptionParagraph}>{point.description}</p>
        )}

        {point.object_id && (
          <button
            className={styles.objectLink}
            onClick={() => navigate(`/objects/${point.object_id}`)}
          >
            Подробнее об объекте →
          </button>
        )}

        {point.lat && point.lng && (
          <a
            className={styles.mapLink}
            href={`https://maps.google.com/?q=${point.lat},${point.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть на карте →
          </a>
        )}

        {!point.description && !point.object_id && (
          <p className={styles.emptyDescription}>
            Описание этой точки маршрута скоро появится.
          </p>
        )}
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────────── */
export const ExcursionRoute = ({ points = [] }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (points.length === 0) return null;

  const selectedPoint = points[selectedIdx];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Маршрут</h2>

        {/* ── Stops navigation ── */}
        <div className={styles.stopsNav}>
          {points.map((point, idx) => {
            const isActive = idx === selectedIdx;
            return (
              <div key={idx} className={styles.stopItem}>
                <button
                  className={`${styles.stopCircle} ${isActive ? styles.stopCircleActive : ""}`}
                  onClick={() => setSelectedIdx(idx)}
                  aria-label={`Точка ${idx + 1}: ${point.address}`}
                >
                  {idx + 1}
                </button>
                {isActive && (
                  <div className={styles.stopLabel}>
                    <span className={styles.stopName}>{point.address}</span>
                  </div>
                )}
                {idx < points.length - 1 && <div className={styles.stopConnector} />}
              </div>
            );
          })}
        </div>

        {/* ── Active stop address ── */}
        <div className={styles.activeStopInfo}>
          <span className={styles.activeStopAddress}>{selectedPoint.address}</span>
        </div>

        {/* ── Stop detail ── */}
        <StopContent key={selectedIdx} point={selectedPoint} />
      </div>
    </section>
  );
};
