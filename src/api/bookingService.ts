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
   * Lấy danh sách nhân viên / Bác sĩ thú y
   * Method & URL: GET /api/shop/staff
   */
  getStaff: async (): Promise<any> => {
    return axiosInstance.get('/api/shop/staff');
  },

  /**
   * 1. Lấy danh sách lịch hẹn (Phân trang, bộ lọc)
   * Method & URL: GET /api/shop/bookings
   */
  getBookings: async (params?: any): Promise<any> => {
    return axiosInstance.get('/api/shop/bookings', { params });
  },

  /**
   * 2. Xem chi tiết một lịch hẹn dựa trên ID
   * Method & URL: GET /api/shop/bookings/{id}
   */
  getBookingById: async (id: string): Promise<any> => {
    return axiosInstance.get(`/api/shop/bookings/${id}`);
  },

  /**
   * 3. Đặt lịch hẹn mới (Tạo lịch)
   * Method & URL: POST /api/shop/bookings
   */
  createBooking: async (payload: CreateBookingRequest): Promise<any> => {
    return axiosInstance.post('/api/shop/bookings', payload);
  },

  /**
   * 4. Cập nhật trạng thái lịch hẹn (Confirmed, CheckedIn, InProgress, Completed, NoShow, Cancelled)
   * Method & URL: PUT /api/shop/bookings/{id}
   */
  updateBookingStatus: async (id: string, status: string, cancellationReason?: string): Promise<any> => {
    return axiosInstance.put(`/api/shop/bookings/${id}`, { status, cancellationReason });
  },

  /**
   * 5. Xóa bỏ một lịch hẹn khỏi hệ thống
   * Method & URL: DELETE /api/shop/bookings/{id}
   */
  deleteBooking: async (id: string): Promise<any> => {
    return axiosInstance.delete(`/api/shop/bookings/${id}`);
  }
};
