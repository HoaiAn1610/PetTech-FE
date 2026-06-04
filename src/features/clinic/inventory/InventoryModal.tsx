import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, PackagePlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { catalogService, inventoryService } from "@/api/services";
import { ProductDto } from "../catalog/ProductModal";

export interface InventoryMovementDto {
  productId: string;
  movementType: "IN" | "OUT" | "ADJUST";
  quantity: number;
  notes?: string;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InventoryMovementDto>({
    defaultValues: {
      productId: "",
      movementType: "IN",
      quantity: 1,
      notes: "",
    },
  });

  const movementTypeValue = watch("movementType");

  useEffect(() => {
    if (isOpen) {
      reset({
        productId: "",
        movementType: "IN",
        quantity: 1,
        notes: "",
      });
      fetchProducts();
    }
  }, [isOpen, reset]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data: any = await catalogService.getProducts();
      const items = Array.isArray(data) ? data : data?.items || [];
      setProducts(items);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoadingProducts(false);
    }
  };

  const onSubmit = async (data: InventoryMovementDto) => {
    setSubmitting(true);
    try {
      await inventoryService.createMovement(data);
      toast.success("Tạo phiếu kho thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create inventory movement", error);
      toast.error("Đã xảy ra lỗi khi tạo phiếu kho. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
              <PackagePlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Tạo phiếu kho
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 pt-5">
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-800 leading-relaxed">
              Lưu ý: Phiếu kho sau khi tạo sẽ không thể chỉnh sửa hoặc xóa nhằm đảm bảo tính minh bạch kế toán.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
          {/* Product */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Sản Phẩm *
            </label>
            <select
              {...register("productId", { required: "Vui lòng chọn sản phẩm" })}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 transition-colors focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary ${
                errors.productId ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
              disabled={loadingProducts}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.sku ? `(${p.sku})` : ""} - Tồn: {p.stockQty}
                </option>
              ))}
            </select>
            {errors.productId && (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.productId.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Movement Type */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Loại Biến Động *
              </label>
              <select
                {...register("movementType", { required: "Vui lòng chọn loại phiếu" })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-colors"
              >
                <option value="IN">Nhập kho</option>
                <option value="OUT">Xuất kho</option>
                <option value="ADJUST">Hao hụt / Hủy</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Số Lượng *
              </label>
              <input
                type="number"
                min="1"
                {...register("quantity", { 
                  required: "Vui lòng nhập số lượng",
                  valueAsNumber: true,
                  min: { value: 1, message: "Số lượng phải > 0" }
                })}
                className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-colors ${
                  errors.quantity ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                }`}
              />
              {errors.quantity && (
                <span className="text-rose-500 text-xs font-bold mt-1 block">
                  {errors.quantity.message}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
              Ghi Chú {movementTypeValue === "ADJUST" && "*"}
            </label>
            <textarea
              placeholder="Nhập lý do xuất/nhập/hủy..."
              {...register("notes", { 
                required: movementTypeValue === "ADJUST" ? "Bắt buộc nhập lý do khi báo hao hụt/hủy" : false,
                maxLength: { value: 500, message: "Ghi chú không vượt quá 500 ký tự" }
              })}
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary transition-colors resize-none ${
                errors.notes ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
              }`}
            />
            {errors.notes && (
              <span className="text-rose-500 text-xs font-bold mt-1 block">
                {errors.notes.message}
              </span>
            )}
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
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận tạo phiếu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
