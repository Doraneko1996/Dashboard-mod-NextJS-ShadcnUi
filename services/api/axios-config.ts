import axios from 'axios';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './endpoints';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => api(originalRequest))
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await api.post('/auth/refresh-token');
            processQueue(null, data.access_token);
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            sessionStorage.removeItem('user');
            window.location.href = '/';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);