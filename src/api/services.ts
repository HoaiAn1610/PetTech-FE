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
    return axiosInstance.get('/api/pets', { params });
  },
  
  getPetById: async (id: string) => {
    return axiosInstance.get(`/api/pets/${id}`);
  },
  
  createPet: async (petData: any) => {
    return axiosInstance.post('/api/pets', petData);
  },
  
  getAllergens: async (petId: string) => {
    return axiosInstance.get(`/api/pets/${petId}/allergens`);
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
    return axiosInstance.post('/api/shop/customers', payload);
  }
};

/**
 * PetTech Shop Settings Service (SaaS Tenant Settings Management)
 */
export const shopSettingsService = {
  getSettings: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/settings');
  },

  updateSettings: async (payload: {
    primaryColor?: string;
    acceptOnlineBookings?: boolean;
    businessHoursStart?: string;
    businessHoursEnd?: string;
    receiptFooter?: string;
  }): Promise<any> => {
    return axiosInstance.put('/api/shop/settings', payload);
  }
};

/**
 * PetTech POS Service
 */
export const posService = {
  getProducts: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/products', { params });
  },
  getCategories: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/categories', { params });
  },
  checkAllergy: async (petId: string, productId: string, payload: { productIngredients: any[] }): Promise<any> => {
    return axiosInstance.post(`/api/shop/pets/${petId}/allergy/analyze/${productId}`, payload);
  },
  createInvoice: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/invoices', payload);
  },
  payInvoice: async (invoiceId: string): Promise<any> => {
    return axiosInstance.patch(`/api/shop/Invoices/${invoiceId}/pay`);
  }
};

export const shopService = {
  getMyPlan: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/my-plan');
  },
  getBillingPlans: async (): Promise<any> => {
    return axiosInstance.get('/api/admin/billing/plans');
  },
  paySubscription: async (payload: { planId: string, durationInMonths: number, returnUrl: string }): Promise<any> => {
    return axiosInstance.post('/api/shop/subscription/pay', payload);
  },
  getProducts: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/products', { params });
  },
  createBooking: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/bookings', payload);
  }
};

export const analyticsService = {
  getDashboardMetrics: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/analytics/dashboard');
  },
  getBookingHeatmap: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/analytics/booking-heatmap');
  }
};

export const crmService = {
  getSegments: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/admin/crm/segments', { params });
  },
  createSegment: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/admin/crm/segments', payload);
  },
  deleteSegment: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/admin/crm/segments/${id}`);
  },
  getCampaigns: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/admin/crm/campaigns', { params });
  },
  createCampaign: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/admin/crm/campaigns', payload);
  }
};

export const medicalService = {
  createMedicalRecord: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/medical/records', payload);
  },
  getMedicalRecords: async (petId: string): Promise<any> => {
    return axiosInstance.get(`/api/medical/pets/${petId}/records`);
  },
  createLabResult: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/medical/lab-results', payload);
  },
  getLabResults: async (petId: string): Promise<any> => {
    return axiosInstance.get('/api/medical/lab-results', { params: { petId } });
  },
  createVaccine: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/medical/vaccines', payload);
  },
  getVaccines: async (petId: string): Promise<any> => {
    return axiosInstance.get('/api/medical/vaccines', { params: { petId } });
  },
  createMedication: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/medical/medications', payload);
  },
  getMedications: async (petId: string): Promise<any> => {
    return axiosInstance.get('/api/medical/medications', { params: { petId } });
  },
  getAllergies: async (petId: string): Promise<any> => {
    return axiosInstance.get('/api/medical/allergies', { params: { petId } });
  }
};

export const fileService = {
  uploadFile: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/api/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const catalogService = {
  getCategories: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/categories', { params });
  },
  createCategory: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/categories', payload);
  },
  updateCategory: async (id: string, payload: any): Promise<any> => {
    return axiosInstance.put(`/api/shop/categories/${id}`, payload);
  },
  deleteCategory: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/shop/categories/${id}`);
  },

  getProducts: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/products', { params });
  },
  createProduct: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/products', payload);
  },
  updateProduct: async (id: string, payload: any): Promise<any> => {
    return axiosInstance.put(`/api/shop/products/${id}`, payload);
  },
  deleteProduct: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/shop/products/${id}`);
  },

  getServices: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/services', { params });
  },
  createService: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/services', payload);
  },
  updateService: async (id: string, payload: any): Promise<any> => {
    return axiosInstance.put(`/api/shop/services/${id}`, payload);
  },
  deleteService: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/shop/services/${id}`);
  }
};

export const inventoryService = {
  getMovements: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/inventory/movements', { params });
  },
  createMovement: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/inventory/movements', payload);
  }
};

/**
 * PetTech Payment Service (PayOS Integration)
 */
export const paymentService = {
  payOnline: async (invoiceId: string): Promise<any> => {
    return axiosInstance.post(`/api/shop/invoices/${invoiceId}/pay-online`);
  }
};

