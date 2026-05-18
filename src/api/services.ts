import { LoginRequest, AuthResponse, TotpVerifyRequest } from '@/types/auth';
import axiosInstance from './axiosInstance';

/**
 * PetTech Auth Service (SaaS B2B2C Authentication)
 */
export const authService = {
  /**
   * Standard Login: Flow 1 (Customers, Staff, Store managers)
   * Calls POST /api/auth/login
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/Auth/login', credentials);
  },

  /**
   * Platform Admin Login: Flow 2 (SuperAdmin, PlatformStaff)
   * Calls POST /api/Auth/admin/login
   */
  adminLogin: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/Auth/admin/login', credentials);
  },

  /**
   * Verify TOTP/OTP for Standard Login Flow
   * Calls POST /api/Auth/2fa/verify
   */
  verifyTotp: async (payload: TotpVerifyRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/Auth/2fa/verify', payload);
  },

  /**
   * Verify TOTP/OTP for Admin Login Flow
   * Calls POST /api/Auth/2fa/verify
   */
  verifyAdminTotp: async (payload: TotpVerifyRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/Auth/2fa/verify', payload);
  },

  /**
   * Get current user profile (using JWT bearer token)
   */
  getProfile: async () => {
    return axiosInstance.get('/api/auth/profile');
  },

  /**
   * Logout user and clear tokens
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};


/**
 * Example Pet Service
 */
export const petService = {
  getPets: async (params?: any) => {
    return axiosInstance.get('/pets', { params });
  },
  
  getPetById: async (id: string) => {
    return axiosInstance.get(`/pets/${id}`);
  },
  
  createPet: async (petData: any) => {
    return axiosInstance.post('/pets', petData);
  }
};

/**
 * PetTech Customer / Pet Owner Service
 */
export const customerService = {
  getCustomers: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/customers', { params });
  },

  createCustomer: async (payload: { fullName: string; email: string; phoneNumber: string; password?: string; role?: string }): Promise<any> => {
    return axiosInstance.post('/api/Auth/register', {
      fullName: payload.fullName,
      displayName: payload.fullName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
      role: payload.role || 'Customer'
    });
  }
};
