import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import { AudioManagerContext } from "../../AudioManagerContext";
import styles from "./ExcursionRoute.module.css";

const formatTime = (seconds) => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

/* ── Mini audio player for a single stop ────────────── */
const PointAudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const manager = useContext(AudioManagerContext);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      if (manager?.current?.playing === audio) manager.current.playing = null;
    };
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [manager]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (manager?.current?.playing && manager.current.playing !== audio) {
        manager.current.playing.pause();
      }
      if (manager?.current) manager.current.playing = audio;
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.pointAudio}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button
        className={styles.pointAudioBtn}
        onClick={togglePlay}
        aria-label={isPlaying ? "Пауза" : "Аудиогид точки"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className={styles.pointAudioTimeline}>
        <span className={styles.pointAudioTime}>{formatTime(currentTime)}</span>
        <div className={styles.pointAudioTrack} onClick={handleSeek}>
          <div className={styles.pointAudioFill} style={{ width: `${progress}%` }} />
          <div className={styles.pointAudioThumb} style={{ left: `${progress}%` }} />
        </div>
        <span className={styles.pointAudioTime}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

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
        {point.audio_url && (
          <PointAudioPlayer audioUrl={point.audio_url} />
        )}

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

        {!point.description && !point.object_id && !point.audio_url && (
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
