import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Define the base URL for the API
const API_URL = import.meta.env.VITE_API_URL || 'https://api.pettech.io/v1';

/**
 * Custom Axios Instance with Interceptors (Middleware)
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Request Interceptor - Acts as a middleware for outgoing requests
 * Use this to add Auth tokens, language headers, etc.
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from storage (example: localStorage or sessionStorage)
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Acts as a middleware for incoming responses
 * Use this to handle global errors (401, 403, 500) or format data
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // You can transform response data here
    return response.data;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (response) {
      // Handle global error codes
      switch (response.status) {
        case 401:
          // Unauthorized - maybe redirect to login or refresh token
          console.error('Unauthorized! Redirecting to login...');
          localStorage.removeItem('token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden! You do not have permission.');
          break;
        case 404:
          console.error('Resource not found!');
          break;
        case 500:
          console.error('Internal Server Error!');
          break;
        default:
          console.error(`Error: ${response.status}`);
      }
    } else {
      // Network error or timeout
      console.error('Network Error or Timeout. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
