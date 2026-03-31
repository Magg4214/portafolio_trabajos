import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 8000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message || 'Request error';
    return Promise.reject({ status, message, details: error?.response?.data?.details, raw: error });
  }
);

export type ApiError = { status?: number; message: string; details?: any; raw?: any };
