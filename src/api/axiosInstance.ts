import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Define the base URL for the API
const API_URL = import.meta.env.VITE_API_URL ?? '';

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
    // Inject Tenant Headers based on hostname
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isBaseDomain = hostname === 'pettechvn.site' || hostname === 'app.pettechvn.site';
    
    if (!isLocalhost && !isBaseDomain && config.headers) {
      if (hostname.includes('pettechvn.site')) {
        const tenantCode = hostname.replace('.pettechvn.site', '');
        config.headers['X-Tenant-Code'] = tenantCode;
      } else {
        config.headers['X-Tenant-Domain'] = hostname;
      }
    }

    // Get token from storage
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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

/**
 * Response Interceptor - Acts as a middleware for incoming responses
 * Use this to handle global errors (401, 403, 500) or format data
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // API Wrapper: Unwrap response.data.data if it exists (assuming Result<T> structure)
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const accessToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          // Call directly using axios to prevent interceptor loop
          const res = await axios.post(`${API_URL}/api/auth/refresh-token`, { 
            accessToken, 
            refreshToken 
          });
          
          // Unwrap Result<T> if needed
          const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken || res.data?.AccessToken;
          const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken || res.data?.RefreshToken;
          
          if (newAccessToken) {
            localStorage.setItem('token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          // window.location.href = '/login'; // Optional
        } finally {
          isRefreshing = false;
        }
      } else {
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }

    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error('Forbidden! You do not have permission.');
          break;
        case 404:
          console.error('Resource not found!');
          // Redirect to shop-not-found if it's a Tenant resolution error
          const errData = error.response.data;
          const errMsg = errData?.message || errData?.Message || errData?.error || '';
          const errCode = errData?.errorCode || errData?.ErrorCode || '';
          
          if (
            errMsg.toLowerCase().includes('tenant not found') || 
            errCode === 'TENANT_NOT_FOUND'
          ) {
             window.location.href = '/shop-not-found';
          }
          break;
        case 500:
          console.error('Internal Server Error!');
          break;
      }
    } else {
      console.error('Network Error or Timeout. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
