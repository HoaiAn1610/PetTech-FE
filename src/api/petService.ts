import axiosInstance from './axiosInstance';
import { 
  PetDto, 
  PagedResult, 
  ResultEnvelope, 
  PetRequestParameters, 
  CreatePetRequest, 
  UpdatePetRequest 
} from '@/types/pet';

/**
 * PetTech Pet Management API Service (SaaS B2B2C Clinic Operations)
 */
export const petService = {
  /**
   * Lấy danh sách thú cưng (Phân trang & Tìm kiếm)
   * Method & URL: GET /api/pets
   * Chức năng: Hiển thị danh sách thú cưng dạng bảng với phân trang, lọc và tìm kiếm.
   * Kết quả trả về: Lớp bọc Result<PagedResult<PetDto>>.
   */
  getPets: async (params?: PetRequestParameters): Promise<ResultEnvelope<PagedResult<PetDto>>> => {
    return axiosInstance.get('/api/pets', { params });
  },

  /**
   * Xem chi tiết một thú cưng
   * Method & URL: GET /api/pets/{id}
   * Chức năng: Xem thông tin hồ sơ chi tiết của thú cưng theo ID.
   * Kết quả trả về: Lớp bọc Result<PetDto>.
   */
  getPetById: async (id: string): Promise<ResultEnvelope<PetDto>> => {
    return axiosInstance.get(`/api/pets/${id}`);
  },

  /**
   * Tạo mới hồ sơ thú cưng
   * Method & URL: POST /api/pets
   * Chức năng: Thêm mới một thú cưng vào hệ thống phòng khám.
   * Kết quả trả về: Lớp bọc Result<PetDto> chứa thú cưng vừa tạo.
   */
  createPet: async (payload: CreatePetRequest): Promise<ResultEnvelope<PetDto>> => {
    return axiosInstance.post('/api/pets', payload);
  },

  /**
   * Cập nhật thông tin thú cưng
   * Method & URL: PUT /api/pets/{id}
   * Chức năng: Sửa đổi thông tin hồ sơ thú cưng hiện tại.
   * Kết quả trả về: Lớp bọc Result<PetDto> sau khi đã cập nhật.
   */
  updatePet: async (id: string, payload: UpdatePetRequest): Promise<ResultEnvelope<PetDto>> => {
    return axiosInstance.put(`/api/pets/${id}`, payload);
  },

  /**
   * Xóa thú cưng (Xóa mềm - Soft Delete)
   * Method & URL: DELETE /api/pets/{id}
   * Chức năng: Vô hiệu hóa/Xóa mềm hồ sơ thú cưng để bảo toàn dữ liệu lịch sử y tế.
   * Kết quả trả về: Lớp bọc Result<boolean> xác nhận xóa thành công.
   */
  deletePet: async (id: string): Promise<ResultEnvelope<boolean>> => {
    return axiosInstance.delete(`/api/pets/${id}`);
  }
};
