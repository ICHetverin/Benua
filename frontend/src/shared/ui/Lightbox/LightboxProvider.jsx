import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Lightbox } from './Lightbox';
import styles from './LightboxProvider.module.css';

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)(\?.*)?$/i;

/** Collects all photo <img> elements within a container into a flat list */
function collectImages(container) {
  return Array.from(container.querySelectorAll('img'))
    .filter((img) => IMAGE_EXT_RE.test(img.getAttribute('src') || ''))
    .map((img) => ({ src: img.src, alt: img.alt || '' }));
}

/**
 * Wrap a detail page with this provider.
 * Any photo image clicked inside will open in the lightbox.
 * Sibling images on the same page become the navigation set.
 */
export function LightboxProvider({ children }) {
  const containerRef = useRef(null);
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 });

  // Capture phase: fires before any child bubble-phase handlers (e.g. navigate cards).
  // stopPropagation prevents the card's onClick from also triggering navigation.
  const handleClick = useCallback((e) => {
    const img = e.target.closest('img');
    if (!img || !IMAGE_EXT_RE.test(img.getAttribute('src') || '')) return;

    e.stopPropagation();

    const images = collectImages(containerRef.current);
    const index = images.findIndex((item) => item.src === img.src);

    setLightbox({ open: true, images, index: Math.max(0, index) });
  }, []);

  const close = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const navigate = useCallback((dir) => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + dir + prev.images.length) % prev.images.length,
    }));
  }, []);

  return (
    <div ref={containerRef} onClickCapture={handleClick} className={styles.zone}>
      {children}

      {lightbox.open &&
        createPortal(
          <Lightbox
            images={lightbox.images}
            index={lightbox.index}
            onClose={close}
            onNavigate={navigate}
          />,
          document.body
        )}
    </div>
  );
}
