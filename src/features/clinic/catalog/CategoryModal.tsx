import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { catalogService } from "@/api/services";
export interface CategoryDto {
  id?: string;
  name: string;
  description?: string;
  emoji?: string;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CategoryDto | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
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
  } = useForm<CategoryDto>({
    defaultValues: {
      name: "",
      description: "",
      emoji: "📂",
      sortOrder: 0,
      isActive: true,
    },
  });

  const isActiveValue = watch("isActive");

  // Sync initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        emoji: initialData.emoji || "📂",
        sortOrder: initialData.sortOrder ?? 0,
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset({
        name: "",
        description: "",
        emoji: "📂",
        sortOrder: 0,
        isActive: true,
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: CategoryDto) => {
    console.log("🚀 Payload gửi lên API:", data);
    setSubmitting(true);
    try {
      if (initialData?.id) {
        // Update (PUT)
        await catalogService.updateCategory(initialData.id, data);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // Create (POST)
        await catalogService.createCategory(data);
        toast.success("Thêm danh mục mới thành công!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save category", error);
      toast.error("Đã xảy ra lỗi khi lưu danh mục. Vui lòng thử lại!");
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
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
              Tên Danh Mục
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Dịch vụ Spa..."
              {...register("name", { 
                required: "Vui lòng nhập tên danh mục",
                maxLength: { value: 100, message: "Tên không vượt quá 100 ký tự" }
              })}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 transition-colors focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary ${
                errors.name ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
            />
            {errors.name && (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Mô tả
            </label>
            <textarea
              placeholder="Nhập mô tả ngắn gọn về danh mục này..."
              {...register("description", {
                maxLength: { value: 500, message: "Mô tả không vượt quá 500 ký tự" }
              })}
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-colors resize-none ${
                errors.description ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
            />
            {errors.description && (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Thứ Tự Hiển Thị
            </label>
            <input
              type="number"
              {...register("sortOrder", { 
                valueAsNumber: true,
                min: { value: 0, message: "Thứ tự không được nhỏ hơn 0" }
              })}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-colors ${
                errors.sortOrder ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
            />
            {errors.sortOrder ? (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.sortOrder.message}
              </span>
            ) : (
              <p className="text-xs text-gray-400 font-medium mt-1.5">
                Số nhỏ hơn sẽ hiển thị lên trước.
              </p>
            )}
          </div>

          {/* Status Switch (Active / Inactive) */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
            <div>
              <p className="text-sm font-black text-gray-850">Trạng thái hoạt động</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Danh mục hiển thị trên hệ thống
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-black text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-75 disabled:pointer-events-none"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black))" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu danh mục"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
