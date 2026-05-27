import { useState, useEffect } from 'react';

/**
 * Хук для ожидания готовности Yandex Maps API.
 *
 * Возвращает объект `ymaps` когда API полностью загружен и готов к работе,
 * либо `null` если ещё грузится.
 *
 * Требует наличия скрипта api-maps.yandex.ru в index.html.
 */
export function useYmaps() {
  const [ymaps, setYmaps] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const initialize = () => {
      if (!window.ymaps || cancelled) return;
      window.ymaps.ready(() => {
        if (!cancelled) setYmaps(window.ymaps);
      });
    };

    if (window.ymaps) {
      initialize();
    } else {
      // Скрипт грузится async — поллим до появления
      const timer = setInterval(() => {
        if (window.ymaps) {
          clearInterval(timer);
          initialize();
        }
      }, 100);
      return () => {
        cancelled = true;
        clearInterval(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return ymaps;
}
