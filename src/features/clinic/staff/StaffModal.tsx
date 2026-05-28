import { useState, useEffect } from "react";
import { X, Key } from "lucide-react";
import { Role } from "@/types/auth";
import { staffService } from "@/api/services";
import { toast } from "sonner";

interface StaffModalProps {
  staff?: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function StaffModal({ staff, onClose, onSuccess }: StaffModalProps) {
  const isEditing = !!staff;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: Role.Receptionist,
    password: "",
    isActive: true
  });

  useEffect(() => {
    if (isEditing && staff) {
      setFormData({
        fullName: staff.fullName || "",
        email: staff.email || "",
        phone: staff.phone || "",
        role: staff.role || Role.Receptionist,
        password: "",
        isActive: staff.isActive !== false
      });
    }
  }, [staff, isEditing]);

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "PetTech@";
    for (let i = 0; i < 4; i++) {
      password += Math.floor(Math.random() * 10);
    }
    setFormData(prev => ({ ...prev, password }));
    toast.success("Đã sinh mật khẩu ngẫu nhiên!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await staffService.updateStaff(staff.id, {
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          isActive: formData.isActive
        });
        toast.success("Cập nhật thông tin nhân viên thành công!");
      } else {
        if (!formData.password) {
          toast.error("Vui lòng nhập mật khẩu hoặc nhấn nút sinh mật khẩu.");
          setLoading(false);
          return;
        }
        await staffService.createStaff({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password
        });
        toast.success("Thêm nhân viên mới thành công!");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Họ và tên *</label>
            <input 
              type="text" 
              required
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none font-medium"
              placeholder="VD: Nguyễn Văn A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email *</label>
              <input 
                type="email" 
                required
                disabled={isEditing}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none font-medium disabled:opacity-60"
                placeholder="VD: email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Số điện thoại</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none font-medium"
                placeholder="VD: 0912345678"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Vai trò (Role) *</label>
            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as Role})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none font-medium"
            >
              <option value={Role.ShopManager}>Quản lý (ShopManager)</option>
              <option value={Role.Vet}>Bác sĩ thú y (Vet)</option>
              <option value={Role.Groomer}>Thợ Grooming (Groomer)</option>
              <option value={Role.Receptionist}>Lễ tân (Receptionist)</option>
            </select>
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mật khẩu *</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none font-medium font-mono"
                  placeholder="Mật khẩu cho nhân viên"
                />
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  <Key className="w-4 h-4" />
                  Sinh mật khẩu
                </button>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-3 mt-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                Đang hoạt động (isActive)
              </label>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
              {isEditing ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
