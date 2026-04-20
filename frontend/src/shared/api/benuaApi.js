import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

export const getPersons = () => api.get('/persons');
export const getPersonById = (id) => api.get(`/persons/${id}`);

export const getObjects = () => api.get('/objects');
export const getObjectById = (id) => api.get(`/objects/${id}`);

export const search = (query) => api.get('/search', { params: { q: query } });
