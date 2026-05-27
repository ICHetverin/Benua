import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Сбрасывает скролл страницы в начало при каждом переходе между маршрутами.
 * Размещается внутри роутера, выше <Outlet />.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
