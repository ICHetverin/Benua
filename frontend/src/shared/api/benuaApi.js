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

export const getPersons = () => api.get('/persons', { params: { limit: 1000 } }).then(normalizeList);
export const getPersonById = (id) => api.get(`/persons/${id}`).then(normalizeId);

export const getObjects = () => api.get('/objects', { params: { size: 1000 } }).then(normalizeList);
export const getObjectById = (id) => api.get(`/objects/${id}`).then(normalizeId);

export const createPerson = (data) => api.post('/persons', data).then(normalizeId);
export const createObject = (data) => api.post('/objects', data).then(normalizeId);

export const search = (query) => api.get('/search', { params: { q: query } });
