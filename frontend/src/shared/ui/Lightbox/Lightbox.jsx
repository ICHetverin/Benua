import { useEffect } from 'react';
import styles from './Lightbox.module.css';

/** Returns caption text: alt → filename-without-extension → fallback */
function getCaption(src, alt) {
  if (alt && alt.trim()) return alt;
  try {
    const filename = new URL(src).pathname.split('/').pop();
    return decodeURIComponent(filename.replace(/\.[^/.]+$/, '')) || 'Изображение';
  } catch {
    return 'Изображение';
  }
}

export function Lightbox({ images, index, onClose, onNavigate }) {
  const { src, alt } = images[index] ?? {};
  const multiple = images.length > 1;

  // Block page scroll while open
  useEffect(() => {
    const saved = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = saved; };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  // Clicking left/right half of the image navigates; caption area is neutral
  const handleImageClick = (e) => {
    if (!multiple) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onNavigate(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
    >
      {/* Close */}
      <button
        className={styles.closeBtn}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Закрыть"
      >
        ✕
      </button>

      {/* Left arrow */}
      {multiple && (
        <button
          className={`${styles.navBtn} ${styles.navLeft}`}
          onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
          aria-label="Предыдущее изображение"
        >
          ‹
        </button>
      )}

      {/* Image + caption — stopPropagation keeps overlay click from closing */}
      <div className={styles.imageArea} onClick={(e) => e.stopPropagation()}>
        <img
          key={src}
          src={src}
          alt={alt}
          className={styles.image}
          onClick={handleImageClick}
          style={{ cursor: multiple ? 'ew-resize' : 'default' }}
        />
        <p className={styles.caption}>{getCaption(src, alt)}</p>
      </div>

      {/* Right arrow */}
      {multiple && (
        <button
          className={`${styles.navBtn} ${styles.navRight}`}
          onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
          aria-label="Следующее изображение"
        >
          ›
        </button>
      )}
    </div>
  );
}
