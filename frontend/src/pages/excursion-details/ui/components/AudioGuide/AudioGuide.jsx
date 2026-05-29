import { useState, useRef, useEffect, useContext } from "react";
import { AudioManagerContext } from "../../AudioManagerContext";
import styles from "./AudioGuide.module.css";

const formatTime = (seconds) => {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const AudioGuide = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const manager = useContext(AudioManagerContext);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime);
    };
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
  }, [isDragging, manager]);

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
      audio.play().catch(() => {
        setIsPlaying(false);
        if (manager?.current) manager.current.playing = null;
      });
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Аудиогид</h2>

        <div className={styles.player}>
          <audio ref={audioRef} src={audioUrl} preload="metadata" />

          <button
            className={styles.playButton}
            onClick={togglePlay}
            aria-label={isPlaying ? "Пауза" : "Играть"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className={styles.timeline}>
            <span className={styles.time}>{formatTime(currentTime)}</span>

            <div
              className={styles.progressTrack}
              onClick={handleSeek}
              role="slider"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              tabIndex={0}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
              <div
                className={styles.progressThumb}
                style={{ left: `${progress}%` }}
              />
            </div>

            <span className={styles.time}>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
