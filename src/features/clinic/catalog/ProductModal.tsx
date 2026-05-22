import React, { useEffect, useState, KeyboardEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { X, Loader2, PackagePlus, Info, Stethoscope, AlertCircle, Box } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";

export interface ProductDto {
  id?: string;
  name: string;
  sku?: string;
  categoryId: string;
  brand?: string;
  description?: string;
  emoji?: string;
  isActive: boolean;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stockQty: number;
  lowStockThreshold: number;
  unit?: string;
  location?: string;
  expiryDate?: string;
  ingredients: string[];
  allergenFlags: string[];
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ProductDto | null;
}

const ingredientsOptions = [
  { value: 'Thịt gà', label: 'Thịt gà' },
  { value: 'Bò', label: 'Bò' },
  { value: 'Cá hồi', label: 'Cá hồi' },
  { value: 'Gạo lứt', label: 'Gạo lứt' },
  { value: 'Ngô/Bắp', label: 'Ngô/Bắp' }
];

const allergenOptions = [
  { value: 'thịt gà', label: 'thịt gà' },
  { value: 'bò', label: 'bò' },
  { value: 'hải sản', label: 'hải sản' },
  { value: 'ngũ cốc', label: 'ngũ cốc' },
  { value: 'sữa', label: 'sữa' }
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "medical">("basic");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductDto>({
    defaultValues: {
      name: "",
      sku: "",
      categoryId: "",
      brand: "",
      description: "",
      emoji: "📦",
      isActive: true,
      price: 0,
      originalPrice: 0,
      costPrice: 0,
      stockQty: 0,
      lowStockThreshold: 5,
      unit: "Hộp",
      location: "",
      expiryDate: "",
      ingredients: [],
      allergenFlags: [],
    },
  });

  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setActiveTab("basic");
    }
  }, [isOpen]);

  // Sync initialData when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        sku: initialData.sku || "",
        categoryId: initialData.categoryId || "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        emoji: initialData.emoji || "📦",
        isActive: initialData.isActive ?? true,
        price: initialData.price ?? 0,
        originalPrice: initialData.originalPrice ?? 0,
        costPrice: initialData.costPrice ?? 0,
        stockQty: initialData.stockQty ?? 0,
        lowStockThreshold: initialData.lowStockThreshold ?? 5,
        unit: initialData.unit || "Hộp",
        location: initialData.location || "",
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split("T")[0] : "",
        ingredients: initialData.ingredients || [],
        allergenFlags: initialData.allergenFlags || [],
      });
    } else {
      reset({
        name: "",
        sku: "",
        categoryId: "",
        brand: "",
        description: "",
        emoji: "📦",
        isActive: true,
        price: 0,
        originalPrice: 0,
        costPrice: 0,
        stockQty: 0,
        lowStockThreshold: 5,
        unit: "Hộp",
        location: "",
        expiryDate: "",
        ingredients: [],
        allergenFlags: [],
      });
    }
  }, [initialData, reset, isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data: any = await axiosInstance.get("/api/shop/categories");
      const items = Array.isArray(data) ? data : (data?.items || []);
      setCategories(items);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  if (!isOpen) return null;

  const onSubmit = async (data: ProductDto) => {
    setSubmitting(true);
    try {
      if (initialData?.id) {
        // Update (PUT)
        await axiosInstance.put(`/api/shop/products/${initialData.id}`, data);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Create (POST)
        await axiosInstance.post("/api/shop/products", data);
        toast.success("Thêm sản phẩm mới thành công!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save product", error);
      toast.error("Đã xảy ra lỗi khi lưu sản phẩm. Vui lòng thử lại!");
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
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <PackagePlus className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              {initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Custom Tabs */}
        <div className="flex px-6 pt-4 border-b border-gray-100 gap-6 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "basic" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Info className="w-4 h-4" />
            Thông tin chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "pricing" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Box className="w-4 h-4" />
            Giá & Kho
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("medical")}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "medical" 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Y tế & AI
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5 overflow-y-auto">
          
          {/* TAB 1: THÔNG TIN CHUNG */}
          <div className={activeTab === "basic" ? "flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300 block" : "hidden"}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Tên Sản Phẩm *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thức ăn hạt Royal Canin..."
                  {...register("name", { 
                    required: "Vui lòng nhập tên sản phẩm",
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

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Mã Vạch (SKU)
                </label>
                <input
                  type="text"
                  placeholder="VD: RC-DOG-01"
                  {...register("sku", { maxLength: { value: 50, message: "Mã vạch không vượt quá 50 ký tự" } })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.sku ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.sku && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.sku.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Danh Mục *
                </label>
                <select
                  {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 transition-colors focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 ${
                    errors.categoryId ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                  disabled={loadingCategories}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.categoryId.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  placeholder="VD: Royal Canin"
                  {...register("brand", { maxLength: { value: 100, message: "Thương hiệu không vượt quá 100 ký tự" } })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.brand ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.brand && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.brand.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Biểu tượng (Emoji)
                </label>
                <input
                  type="text"
                  placeholder="📦"
                  {...register("emoji")}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-center text-lg font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Mô tả sản phẩm
                </label>
                <textarea
                  placeholder="Nhập mô tả ngắn gọn..."
                  {...register("description", { maxLength: { value: 1000, message: "Mô tả không vượt quá 1000 ký tự" } })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors resize-none ${
                    errors.description ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.description && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>

            {/* Status Switch (Active / Inactive) */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 mt-1">
              <div>
                <p className="text-sm font-black text-gray-850">Trạng thái bán</p>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  Sản phẩm sẽ hiển thị trên hệ thống
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
          </div>

          {/* TAB 2: GIÁ & KHO */}
          <div className={activeTab === "pricing" ? "flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300 block" : "hidden"}>
            {/* Nhóm Giá */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <h4 className="text-sm font-black text-gray-800">Thiết lập Giá</h4>
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Giá Bán (VNĐ) *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("price", {
                    required: "Vui lòng nhập giá bán",
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá bán không được nhỏ hơn 0" }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
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
                  Giá Gốc (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("originalPrice", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá gốc không được nhỏ hơn 0" }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.originalPrice ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.originalPrice && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.originalPrice.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Giá Vốn (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("costPrice", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Giá vốn không được nhỏ hơn 0" }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.costPrice ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.costPrice && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.costPrice.message}
                  </span>
                )}
              </div>
            </div>

            {/* Nhóm Kho */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <h4 className="text-sm font-black text-gray-800">Quản lý Kho</h4>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Số lượng Tồn Kho
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("stockQty", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Tồn kho không được nhỏ hơn 0" }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.stockQty ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.stockQty && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.stockQty.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Mức cảnh báo sắp hết
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("lowStockThreshold", { 
                    valueAsNumber: true,
                    min: { value: 0, message: "Ngưỡng cảnh báo không nhỏ hơn 0" }
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.lowStockThreshold ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.lowStockThreshold && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.lowStockThreshold.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Đơn vị tính
                </label>
                <input
                  type="text"
                  placeholder="VD: Hộp, Gói, Lọ..."
                  {...register("unit", { maxLength: { value: 50, message: "Đơn vị không vượt quá 50 ký tự" } })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.unit ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.unit && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.unit.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                  Vị trí kệ
                </label>
                <input
                  type="text"
                  placeholder="VD: Kệ A1"
                  {...register("location", { maxLength: { value: 100, message: "Vị trí không vượt quá 100 ký tự" } })}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white border outline-none text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors ${
                    errors.location ? "border-rose-300 focus:border-rose-500" : "border-gray-200"
                  }`}
                />
                {errors.location && (
                  <span className="text-rose-500 text-xs font-bold mt-1 block">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TAB 3: Y TẾ & AI */}
          <div className={activeTab === "medical" ? "flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300 block" : "hidden"}>
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-blue-800 leading-relaxed">
                Thông tin y tế giúp hệ thống AI phân tích và đưa ra cảnh báo dị ứng hoặc tư vấn dinh dưỡng cho thú cưng một cách chính xác.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Ngày hết hạn (Expiry Date)
              </label>
              <input
                type="date"
                {...register("expiryDate")}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Thành phần (Ingredients)
              </label>
              <Controller
                name="ingredients"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CreatableSelect
                    isMulti
                    options={ingredientsOptions}
                    value={(value || []).map(val => ({ value: val, label: val }))}
                    onChange={(selected) => {
                      onChange(selected.map(opt => opt.value));
                    }}
                    placeholder="Chọn hoặc nhập thành phần mới..."
                    formatCreateLabel={(inputValue) => `Tạo mới: "${inputValue}"`}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        borderColor: state.isFocused ? '#6366f1' : '#e5e7eb',
                        backgroundColor: '#f9fafb',
                        minHeight: '46px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { borderColor: state.isFocused ? '#6366f1' : '#d1d5db' }
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        zIndex: 100
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#eef2ff',
                        borderRadius: '0.5rem',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#4338ca',
                        fontWeight: 700,
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#4338ca',
                        ':hover': {
                          backgroundColor: '#c7d2fe',
                          color: '#312e81',
                        },
                      }),
                    }}
                  />
                )}
              />
            </div>

            {/* Allergen Flags */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
                Cảnh báo dị ứng (Allergen Flags)
              </label>
              <Controller
                name="allergenFlags"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CreatableSelect
                    isMulti
                    options={allergenOptions}
                    value={(value || []).map(val => ({ value: val, label: val }))}
                    onChange={(selected) => {
                      onChange(selected.map(opt => opt.value));
                    }}
                    placeholder="Chọn hoặc nhập chất gây dị ứng..."
                    formatCreateLabel={(inputValue) => `Tạo mới: "${inputValue}"`}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        borderColor: state.isFocused ? '#f43f5e' : '#e5e7eb',
                        backgroundColor: '#f9fafb',
                        minHeight: '46px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { borderColor: state.isFocused ? '#f43f5e' : '#d1d5db' }
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        zIndex: 100
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#fff1f2',
                        borderRadius: '0.5rem',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#be123c',
                        fontWeight: 700,
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#be123c',
                        ':hover': {
                          backgroundColor: '#fecdd3',
                          color: '#881337',
                        },
                      }),
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 flex-shrink-0">
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
                "Lưu sản phẩm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
