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

  createCustomer: async (payload: { fullName: string; email: string; phoneNumber: string; phone?: string; password?: string; role?: string }): Promise<any> => {
    return axiosInstance.post('/api/shop/customers', payload);
  },

  updateCustomerPassword: async (customerId: string, payload: { newPassword: string }): Promise<any> => {
    return axiosInstance.put(`/api/shop/customers/${customerId}/password`, payload);
  }
};

/**
 * PetTech Shop Settings Service (SaaS Tenant Settings Management)
 */
export const shopSettingsService = {
  getPublicSettings: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/settings/public');
  },
  getSettings: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/settings');
  },
  getShopProfile: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/settings/profile');
  },
  updateSmtpConfig: async (payload: {
    smtpHost?: string;
    smtpPort: number;
    smtpUser?: string;
    smtpPass?: string;
  }): Promise<any> => {
    return axiosInstance.put('/api/shop/settings/smtp', payload);
  },

  updateSettings: async (payload: {
    primaryColor?: string;
    acceptOnlineBookings?: boolean;
    businessHoursStart?: string;
    businessHoursEnd?: string;
    receiptFooter?: string;
    customShopName?: string;
    customLogoUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    bannerUrl?: string;
    aboutUsText?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    zaloPhone?: string;
    showTeamSection?: boolean;
    showReviewsSection?: boolean;
  }): Promise<any> => {
    // Forward to the upgraded landing settings endpoint to prevent 405 Method Not Allowed
    return axiosInstance.put('/api/shop/settings/landing', payload);
  },

  updateLandingSettings: async (payload: {
    primaryColor?: string;
    customShopName?: string;
    customLogoUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    bannerUrl?: string;
    aboutUsText?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    zaloPhone?: string;
    showTeamSection?: boolean;
    showReviewsSection?: boolean;
  }): Promise<any> => {
    return axiosInstance.put('/api/shop/settings/landing', payload);
  },

  updateProfileSettings: async (payload: {
    name?: string;
    ownerName?: string;
    email?: string;
    phone?: string;
    address?: string;
    logoUrl?: string;
    timezone?: string;
    acceptOnlineBookings?: boolean;
    receiptFooter?: string;
    businessHoursStart?: string;
    businessHoursEnd?: string;
  }): Promise<any> => {
    return axiosInstance.put('/api/shop/settings/profile', payload);
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
  },
  getPendingInvoices: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/invoices', { params });
  },
  updateDeliveryStatus: async (invoiceId: string, payload: { deliveryStatus: string; note?: string }): Promise<any> => {
    return axiosInstance.put(`/api/shop/invoices/${invoiceId}/delivery-status`, payload);
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
  getRevenueChart: async (days = 30): Promise<any> => {
    return axiosInstance.get('/api/shop/analytics/revenue-chart', { params: { days } });
  },
  getTopServices: async (top = 5): Promise<any> => {
    return axiosInstance.get('/api/shop/analytics/top-services', { params: { top } });
  },
  getBookingHeatmap: async (days = 30): Promise<any> => {
    return axiosInstance.get('/api/shop/analytics/bookings-heatmap', { params: { days } });
  },
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
    const typeMapping: Record<string, number> = {
      VaccineReminder: 0,
      Birthday: 1,
      ChurnWinback: 2,
      CartAbandonment: 3,
      PostVisit: 4,
      Custom: 5
    };

    const typeInt = typeMapping[payload.type] ?? 5;

    const mappedPayload = {
      ...payload,
      type: typeInt
    };

    return axiosInstance.post('/api/admin/crm/campaigns', mappedPayload);
  },
  executeCampaign: async (id: string): Promise<any> => {
    return axiosInstance.post(`/api/admin/crm/campaigns/${id}/execute`);
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
  createVaccine: async (payloadOrPetId: any, arg2?: any): Promise<any> => {
    if (typeof payloadOrPetId === 'string' && arg2) {
      return axiosInstance.post(`/api/medical/pets/${payloadOrPetId}/vaccines`, arg2);
    }
    const { petId, ...rest } = payloadOrPetId;
    return axiosInstance.post(`/api/medical/pets/${petId}/vaccines`, rest);
  },
  getVaccines: async (petId: string): Promise<any> => {
    return axiosInstance.get(`/api/medical/pets/${petId}/vaccines`);
  },
  deleteVaccine: async (vaccineId: string): Promise<any> => {
    return axiosInstance.delete(`/api/medical/vaccines/${vaccineId}`);
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

    const url = '/api/files/upload';
    console.log(`Attempting file upload to: ${url}`);
    
    const response = await axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log(`File upload successful using: ${url}`);
    return response;
  },
  
  getPresignedUrl: async (fileUrl: string, expiryMinutes = 60): Promise<any> => {
    return axiosInstance.get('/api/files/presigned-url', {
      params: { fileUrl, expiryMinutes }
    });
  },

  deleteFile: async (fileUrl: string): Promise<any> => {
    return axiosInstance.delete('/api/files', {
      params: { fileUrl }
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

// Staff Management APIs
export const staffService = {
  getStaff: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/staff', { params });
  },
  getStaffDetails: async (id: string): Promise<any> => {
    return axiosInstance.get(`/api/shop/staff/${id}`);
  },
  createStaff: async (payload: any): Promise<any> => {
    return axiosInstance.post('/api/shop/staff', payload);
  },
  updateStaff: async (id: string, payload: any): Promise<any> => {
    return axiosInstance.put(`/api/shop/staff/${id}`, payload);
  },
  deleteStaff: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/shop/staff/${id}`);
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

