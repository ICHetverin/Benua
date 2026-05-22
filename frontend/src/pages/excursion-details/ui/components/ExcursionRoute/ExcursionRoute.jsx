import { useState } from "react";
import { useObjectById } from "entities/object";
import styles from "./ExcursionRoute.module.css";

/* ── Carousel ─────────────────────────────────── */
const Carousel = ({ images = [] }) => {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return <div className={styles.carouselPlaceholder} />;
  }

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselImageWrapper}>
        <img
          key={idx}
          src={images[idx].url_to_s3}
          alt={images[idx].text ?? ""}
          className={styles.carouselImage}
          loading="lazy"
        />
      </div>
      <div className={styles.carouselControls}>
        <button
          className={styles.carouselArrow}
          onClick={prev}
          aria-label="Предыдущее фото"
          disabled={images.length <= 1}
        >
          ←
        </button>
        <div className={styles.carouselDots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Фото ${i + 1}`}
            />
          ))}
        </div>
        <button
          className={styles.carouselArrow}
          onClick={next}
          aria-label="Следующее фото"
          disabled={images.length <= 1}
        >
          →
        </button>
      </div>
    </div>
  );
};

/* ── Stop content ──────────────────────────────── */
const StopContent = ({ buildingId, fallbackImages = [] }) => {
  const { data: building, isLoading } = useObjectById(buildingId);

  const images =
    building?.images?.length > 0 ? building.images : fallbackImages;

  const descriptions = Array.isArray(building?.description)
    ? building.description
    : [];

  return (
    <div className={styles.stopContent}>
      <div className={styles.carouselColumn}>
        {isLoading ? (
          <div className={styles.carouselPlaceholder} />
        ) : (
          <Carousel images={images} />
        )}
      </div>

      <div className={styles.textColumn}>
        {isLoading ? (
          <p className={styles.loading}>Загрузка...</p>
        ) : descriptions.length > 0 ? (
          descriptions.map((block, i) => (
            <p key={i} className={styles.descriptionParagraph}>
              {block.content}
            </p>
          ))
        ) : building?.history ? (
          <p className={styles.descriptionParagraph}>{building.history}</p>
        ) : (
          <p className={styles.emptyDescription}>
            Описание этой точки маршрута скоро появится.
          </p>
        )}
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────── */
export const ExcursionRoute = ({ buildings = [], excursionImages = [] }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (buildings.length === 0) return null;

  const selectedBuilding = buildings[selectedIdx];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Экскурсия</h2>

        {/* ── Stops navigation ── */}
        <div className={styles.stopsNav}>
          {buildings.map((building, idx) => {
            const isActive = idx === selectedIdx;
            return (
              <div key={building._id} className={styles.stopItem}>
                <button
                  className={`${styles.stopCircle} ${isActive ? styles.stopCircleActive : ""}`}
                  onClick={() => setSelectedIdx(idx)}
                  aria-label={`Остановка ${idx + 1}: ${building.name}`}
                >
                  {idx + 1}
                </button>
                {isActive && (
                  <div className={styles.stopLabel}>
                    <span className={styles.stopName}>{building.name}</span>
                  </div>
                )}
                {idx < buildings.length - 1 && (
                  <div className={styles.stopConnector} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Active stop address (lazy-loaded) ── */}
        <ActiveStopAddress
          buildingId={selectedBuilding._id}
          fallbackName={selectedBuilding.name}
        />

        {/* ── Stop detail ── */}
        <StopContent
          key={selectedBuilding._id}
          buildingId={selectedBuilding._id}
          fallbackImages={excursionImages}
        />
      </div>
    </section>
  );
};

/* ── Active stop address ────────────────────────── */
const ActiveStopAddress = ({ buildingId, fallbackName }) => {
  const { data: building } = useObjectById(buildingId);
  return (
    <div className={styles.activeStopInfo}>
      <span className={styles.activeStopName}>
        {building?.name ?? fallbackName}
      </span>
      {building?.address && (
        <span className={styles.activeStopAddress}>{building.address}</span>
      )}
    </div>
  );
};
