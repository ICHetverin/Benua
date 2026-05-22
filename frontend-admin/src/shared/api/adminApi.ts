import axios, { type AxiosRequestConfig } from 'axios';
import { API_URL } from 'shared/config/env';
import { getToken, clearAuth } from 'shared/lib/storage';

// Interceptor unwraps r.data, so override Axios types to reflect actual runtime behavior
const _adminApi = axios.create({
  baseURL: API_URL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

_adminApi.interceptors.request.use((cfg) => {
  const token = getToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

_adminApi.interceptors.response.use(
  (r) => r.data,
  (e) => {
    if (e.response?.status === 401) {
      clearAuth();
      window.location.assign('/admin/login');
    }
    return Promise.reject(e.response?.data ?? e);
  },
);

// Typed wrapper that returns unwrapped data (matching interceptor behavior)
export const adminApi = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    _adminApi.get(url, config) as unknown as Promise<T>,
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    _adminApi.post(url, data, config) as unknown as Promise<T>,
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    _adminApi.patch(url, data, config) as unknown as Promise<T>,
  delete: <T = void>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    _adminApi.delete(url, config) as unknown as Promise<T>,
};

export const uploadMultipart = <T>(url: string, fd: FormData): Promise<T> =>
  _adminApi.post(url, fd, {
    headers: { 'Content-Type': undefined as unknown as string },
  }) as unknown as Promise<T>;
