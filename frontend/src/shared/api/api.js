import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const api = {
  getPersons: async () => {
    const response = await axios.get(`${BASE_URL}/persons`);
    return response.data;
  },

  getPersonById: async (id) => {
    const response = await axios.get(`${BASE_URL}/persons/${id}`);
    return response.data;
  },

  getObjects: async () => {
    const response = await axios.get(`${BASE_URL}/objects`);
    return response.data;
  },

  getObjectById: async (id) => {
    const response = await axios.get(`${BASE_URL}/objects/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await axios.get(`${BASE_URL}/search?q=${query}`);
    return response.data;
  }
};