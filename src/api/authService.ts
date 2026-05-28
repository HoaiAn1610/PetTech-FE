import axiosInstance from './axiosInstance';
import { LoginRequest, AuthResponse } from '@/types/auth';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login for Customers, Staff, and Store Managers
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/auth/login', data);
  },

  /**
   * Login for Platform SuperAdmins and Staff
   */
  adminLogin: async (data: LoginRequest): Promise<AuthResponse> => {
    return axiosInstance.post('/api/admin/auth/login', data);
  },

  /**
   * Verify TOTP/2FA
   */
  verifyTwoFactor: async (code: string): Promise<AuthResponse> => {
    return axiosInstance.post('/api/auth/verify-2fa', { code });
  },

  /**
   * Logout (optional endpoint if backend supports it)
   */
  logout: async (): Promise<void> => {
    return axiosInstance.post('/api/auth/logout');
  }
};
