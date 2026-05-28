import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { catalogService } from "@/api/services";
export interface ServiceDto {
  id?: string;
  name: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  emoji?: string;
  color?: string;
  category?: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ServiceDto | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceDto>({
    defaultValues: {
      name: "",
      price: 0,
      durationMinutes: 30,
      isActive: true,
      emoji: "🐾",
      color: "#2563EB",
      category: "Dịch vụ chung",
    },
  });

  const isActiveValue = watch("isActive");
  const colorValue = watch("color");

  // Sync initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        price: initialData.price,
        durationMinutes: initialData.durationMinutes,
        isActive: initialData.isActive,
        emoji: initialData.emoji || "🐾",
        color: initialData.color || "#2563EB",
        category: initialData.category || "Dịch vụ chung",
      });
    } else {
      reset({
        name: "",
        price: 0,
        durationMinutes: 30,
        isActive: true,
        emoji: "🐾",
        color: "#2563EB",
        category: "Dịch vụ chung",
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: ServiceDto) => {
    setSubmitting(true);
    try {
      if (initialData?.id) {
        // Update (PUT)
        await catalogService.updateService(initialData.id, data);
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        // Create (POST)
        await catalogService.createService(data);
        toast.success("Thêm dịch vụ mới thành công!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save service", error);
      toast.error("Đã xảy ra lỗi khi lưu dịch vụ. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Tên Dịch Vụ
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Tắm chải toàn bộ..."
              {...register("name", { 
                required: "Vui lòng nhập tên dịch vụ",
                maxLength: { value: 100, message: "Tên không vượt quá 100 ký tự" }
              })}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 ${
                errors.name ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Phân Loại (Nhóm)
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
              >
                <option value="Dịch vụ chung">Dịch vụ chung</option>
                <option value="Grooming & Spa">Grooming & Spa</option>
                <option value="Khám & Điều trị">Khám & Điều trị</option>
                <option value="Tiêm phòng">Tiêm phòng</option>
                <option value="Lưu trú (Hotel)">Lưu trú (Hotel)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Màu sắc nhận diện
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colorValue}
                  onChange={(e) => setValue("color", e.target.value)}
                  className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 outline-none cursor-pointer flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="#2563EB"
                  {...register("color")}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Giá Tiền (VNĐ)
              </label>
              <input
                type="number"
                min="0"
                {...register("price", {
                  required: "Vui lòng nhập giá tiền",
                  valueAsNumber: true,
                  min: { value: 0, message: "Giá tiền không được nhỏ hơn 0" }
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                  errors.price ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                }`}
              />
              {errors.price && (
                <span className="text-rose-500 text-xs font-bold mt-1 block">
                  {errors.price.message}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Thời Lượng (Phút)
              </label>
              <input
                type="number"
                min="1"
                {...register("durationMinutes", {
                  required: "Vui lòng nhập thời lượng",
                  valueAsNumber: true,
                  min: { value: 1, message: "Thời lượng không được nhỏ hơn 1 phút" }
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                  errors.durationMinutes ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                }`}
              />
              {errors.durationMinutes && (
                <span className="text-rose-500 text-xs font-bold mt-1 block">
                  {errors.durationMinutes.message}
                </span>
              )}
            </div>
          </div>

          {/* Status Switch (Active / Inactive) */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
            <div>
              <p className="text-sm font-black text-gray-850">Trạng thái hoạt động</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Dịch vụ kích hoạt sẽ hiển thị trên danh sách đặt lịch
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("isActive", !isActiveValue)}
              className={`relative inline-flex h-6.5 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActiveValue ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isActiveValue ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-black text-sm transition-all shadow-md shadow-indigo-100 hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none"
              style={{ background: "linear-gradient(135deg, #4f46e5, #4338ca)" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu dịch vụ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
