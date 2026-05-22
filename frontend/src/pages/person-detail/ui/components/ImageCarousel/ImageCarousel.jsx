import { useState } from 'react';
import styles from './ImageCarousel.module.css';

export const ImageCarousel = ({ images = [] }) => {
  const [idx, setIdx] = useState(0);

  if (!images.length) return null;

  const current = images[idx];
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.imageWrapper}>
        <img
          key={idx}
          src={current.url_to_s3}
          alt={current.text ?? ''}
          className={styles.image}
          loading="lazy"
        />
      </div>

      {current.text && (
        <div className={styles.caption}>
          <span className={styles.captionLabel}>Подпись изображения</span>
          <span className={styles.captionText}>{current.text}</span>
        </div>
      )}

      {images.length > 1 && (
        <div className={styles.controls}>
          <button className={styles.arrow} onClick={prev} aria-label="Предыдущее">←</button>
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Изображение ${i + 1}`}
              />
            ))}
          </div>
          <button className={styles.arrow} onClick={next} aria-label="Следующее">→</button>
        </div>
      )}
    </div>
  );
};
