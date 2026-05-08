export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  PERSONS: '/persons',
  PERSONS_NEW: '/persons/new',
  PERSONS_EDIT: (id: string) => `/persons/${id}`,
  BUILDINGS: '/buildings',
  BUILDINGS_NEW: '/buildings/new',
  BUILDINGS_EDIT: (id: string) => `/buildings/${id}`,
  EXCURSIONS: '/excursions',
  EXCURSIONS_NEW: '/excursions/new',
  EXCURSIONS_EDIT: (id: string) => `/excursions/${id}`,
  USERS: '/users',
} as const;
