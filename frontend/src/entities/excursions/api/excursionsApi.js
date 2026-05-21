const BASE = '/api/excursions';

export const fetchExcursions = () =>
  fetch(BASE).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch excursions');
    return r.json();
  });

export const fetchExcursionById = (id) =>
  fetch(`${BASE}/${id}`).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch excursion: ${id}`);
    return r.json();
  });
