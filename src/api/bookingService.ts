import axiosInstance from './axiosInstance';

export interface CreateBookingRequest {
  petId: string;
  ownerId: string;
  serviceId: string;
  assignedStaffId: string | null;
  bookingDate: string;
  startTime: string; // format "HH:mm:ss" or similar TimeSpan string
  notes?: string | null;
}

export const bookingService = {
  /**
   * Lấy danh sách dịch vụ spa/grooming/y tế
   * Method & URL: GET /api/shop/services
   */
  getServices: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/services');
  },

  /**
   * Lấy danh sách nhân viên / bác sĩ thú y
   * Method & URL: GET /api/shop/staff
   */
  getStaff: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/staff');
  },

  /**
   * Tạo lịch hẹn khám/grooming mới
   * Method & URL: POST /api/shop/bookings
   */
  createBooking: async (payload: CreateBookingRequest): Promise<any> => {
    return axiosInstance.post('/api/shop/bookings', payload);
  }
};
