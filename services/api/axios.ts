import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Khởi tạo axios instance với config mặc định
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Hàm helper để lấy token từ cookie
const getAccessTokenFromCookie = (): string | undefined => {
  const cookies = document.cookie.split(';');
  return cookies
    .find(cookie => cookie.trim().startsWith('accessToken='))
    ?.split('=')[1];
};

// Hàm helper để log request
const logRequest = (config: InternalAxiosRequestConfig) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
  }
};

// Hàm helper để log response
const logResponse = (response: AxiosResponse) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
  }
};

// Hàm helper để log error
const logError = (error: AxiosError) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method
      }
    });

    if (error.response?.status === 403) {
      console.error('Forbidden Error:', {
        token: error.config?.headers?.Authorization,
        cookies: document.cookie
      });
    }
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    logRequest(config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    logResponse(response);
    return response;
  },
  (error: AxiosError) => {
    logError(error);
    return Promise.reject(error);
  }
);

export default api;
