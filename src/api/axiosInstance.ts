import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Define the base URL for the API.
// - On localhost: Vite dev server proxies /api/* → https://api.pettechvn.site (see vite.config.ts)
// - On Vercel: vercel.json rewrites /api/* → https://api.pettechvn.site (server-to-server, no Mixed Content)
// - VITE_API_URL should be left EMPTY on Vercel so relative URLs (/api/*) go through the proxy.
// - Only set VITE_API_URL explicitly if the backend has a proper HTTPS domain.
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
    // Inject Tenant Headers based on hostname or localStorage fallback (for localhost / dashboard development)
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isBaseDomain = hostname === 'pettechvn.site' || hostname === 'app.pettechvn.site';
    
    let tenantCode = '';
    let tenantDomain = '';
    
    if (!isLocalhost && !isBaseDomain) {
      if (hostname.includes('pettechvn.site')) {
        tenantCode = hostname.replace('.pettechvn.site', '');
      } else {
        tenantDomain = hostname;
      }
    } else {
      // Fallback to localStorage for localhost development or centralized dashboard
      tenantCode = localStorage.getItem('pettech_current_tenant_code') || '';
      tenantDomain = localStorage.getItem('pettech_current_tenant_domain') || '';
    }
    
    if (config.headers) {
      if (tenantCode) {
        if (typeof (config.headers as any).set === 'function') {
          (config.headers as any).set('X-Tenant-Code', tenantCode);
        } else {
          config.headers['X-Tenant-Code'] = tenantCode;
        }
      } else if (tenantDomain) {
        if (typeof (config.headers as any).set === 'function') {
          (config.headers as any).set('X-Tenant-Domain', tenantDomain);
        } else {
          config.headers['X-Tenant-Domain'] = tenantDomain;
        }
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
          const errData: any = error.response.data;
          
          let errMsg = '';
          let errCode = '';
          
          if (typeof errData === 'string') {
            errMsg = errData;
          } else if (errData && typeof errData === 'object') {
            errMsg = errData.message || errData.Message || errData.error || '';
            errCode = errData.errorCode || errData.ErrorCode || '';
          }
          
          if (
            errMsg.toLowerCase().includes('tenant not found') || 
            errCode === 'TENANT_NOT_FOUND' || 
            errCode === 'InvalidTenant'
          ) {
             if (window.location.pathname !== '/shop-not-found') {
               window.location.href = '/shop-not-found';
             }
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
