import axiosInstance from './axiosInstance';

/**
 * Example Auth Service
 */
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: any) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return axiosInstance.get('/auth/profile');
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    // You might also want to call an API to invalidate the session
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
