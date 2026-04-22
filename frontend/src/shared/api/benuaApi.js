import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

export const getPersons = () => api.get('/api/persons');
export const getPersonById = (id) => api.get(`/api/persons/${id}`);

export const getObjects = () => api.get('/api/objects');
export const getObjectById = (id) => api.get(`/api/objects/${id}`);

export const createPerson = (data) => api.post('/api/persons', data);
export const createObject = (data) => api.post('/api/objects', data);

export const search = (query) => api.get('/api/search', { params: { q: query } });
