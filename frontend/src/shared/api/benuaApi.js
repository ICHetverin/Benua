import axios from 'axios';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || '') + '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

export const getPersons = () => api.get('/persons', { params: { limit: 1000 } });
export const getPersonById = (id) => api.get(`/persons/${id}`);

export const getObjects = () => api.get('/objects', { params: { size: 1000 } });
export const getObjectById = (id) => api.get(`/objects/${id}`);

export const createPerson = (data) => api.post('/persons', data);
export const createObject = (data) => api.post('/objects', data);

export const search = (query) => api.get('/search', { params: { q: query } });
