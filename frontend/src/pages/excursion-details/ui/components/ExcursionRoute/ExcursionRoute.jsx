import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowIcon } from "shared/assets/icons/ArrowIcon";
import styles from "./ExcursionRoute.module.css";

/* ── Inline audio player per stop ──────────────────── */
const formatTime = (s) => {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
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

const StopAudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); }
    setIsPlaying(!isPlaying);
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
    <div className={styles.audioPlayer}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <button className={styles.audioPlayBtn} onClick={toggle} aria-label={isPlaying ? "Пауза" : "Играть"}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className={styles.audioTimeline}>
        <span className={styles.audioTime}>{formatTime(currentTime)}</span>
        <div className={styles.audioTrack} onClick={handleSeek} role="slider" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={currentTime} tabIndex={0}>
          <div className={styles.audioFill} style={{ width: `${progress}%` }} />
          <div className={styles.audioThumb} style={{ left: `${progress}%` }} />
        </div>
        <span className={styles.audioTime}>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

/* ── Stop content ──────────────────────────────── */
const StopContent = ({ point }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.stopContent}>
      <div className={styles.photoColumn}>
        {point.photo_url ? (
          <div className={styles.photoWrapper}>
            <img src={point.photo_url} alt={point.address} className={styles.photo} loading="lazy" />
          </div>
        ) : (
          <div className={styles.photoPlaceholder} />
        )}
      </div>

      <div className={styles.textColumn}>
        {point.description && (
          <p className={styles.descriptionParagraph}>{point.description}</p>
        )}

        {point.object_id && (
          <button className={styles.objectLink} onClick={() => navigate(`/objects/${point.object_id}`)}>
            Подробнее об объекте →
          </button>
        )}

        {point.audio_url && (
          <StopAudioPlayer audioUrl={point.audio_url} />
        )}

        {!point.description && !point.object_id && !point.audio_url && (
          <p className={styles.emptyDescription}>Описание этой точки маршрута скоро появится.</p>
        )}
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────── */
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
