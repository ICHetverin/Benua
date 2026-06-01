import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// CDN-worker — не требует изменений конфига webpack/CRA
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Рендерит первую страницу PDF в <canvas>.
 * Пока идёт загрузка — показывает placeholderClassName-заглушку.
 * При ошибке — тоже заглушку.
 *
 * @param {string}  url                  - presigned URL к PDF-файлу
 * @param {string}  [canvasClassName]    - CSS-класс для canvas
 * @param {string}  [placeholderClassName] - CSS-класс для div-заглушки
 * @param {string}  [alt]                - aria-label для canvas
 */
export function PdfThumbnail({ url, canvasClassName, placeholderClassName, alt = 'PDF' }) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'done' | 'error'

  useEffect(() => {
    if (!url) { setStatus('error'); return; }

    let cancelled = false;
    setStatus('loading');

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url });
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Масштабируем по ширине контейнера
        const containerWidth = canvas.parentElement?.clientWidth || 320;
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: canvas.getContext('2d'),
          viewport,
        }).promise;

        if (!cancelled) setStatus('done');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={canvasClassName}
        style={{ display: status === 'done' ? 'block' : 'none', width: '100%' }}
      />
      {status !== 'done' && <div className={placeholderClassName} />}
    </>
  );
}
