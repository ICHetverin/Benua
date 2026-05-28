import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || '') + '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

const normalizeId = (entity) => {
  if (!entity || typeof entity !== 'object') return entity;
  if (entity._id) return entity;
  if (entity.id) return { ...entity, _id: entity.id };
  return entity;
};

const normalizeList = (items) => {
  if (Array.isArray(items)) return items.map(normalizeId);
  if (items && Array.isArray(items.data)) {
    return { ...items, data: items.data.map(normalizeId) };
  }
  return items;
};

export const getPersons = (search) =>
  api.get('/persons', { params: { size: 1000, ...(search ? { search } : {}) } }).then(normalizeList);
export const getPersonById = (id) => api.get(`/persons/${id}`).then(normalizeId);

export const getObjects = (search) =>
  api.get('/objects', { params: { size: 1000, ...(search ? { search } : {}) } }).then(normalizeList);
export const getObjectById = (id) => api.get(`/objects/${id}`).then(normalizeId);

export const search = (query) => api.get('/search', { params: { q: query } });

export const getPublicExcursions = () =>
  api.get('/excursions', { params: { size: 1000 } }).then(normalizeList);

export const getExcursions = (search) =>
  api.get('/excursions', { params: { size: 1000, ...(search ? { search } : {}) } }).then(normalizeList);

export const getPublicExcursionById = (id) =>
  api.get(`/excursions/${id}`).then(normalizeId);

export const getBurials = () =>
  api.get('/burials').then(normalizeList);

export const getPbCemeteries = () =>
  api.get('/cemeteries').then(normalizeList);

export const getInfographics = () =>
  api.get('/infographics', { params: { size: 1000 } }).then(normalizeList);

export const getInfographicById = (id) => api.get(`/infographics/${id}`).then(normalizeId);
