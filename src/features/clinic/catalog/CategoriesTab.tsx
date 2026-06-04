import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { catalogService } from "@/api/services";
import { CategoryDto } from "./CategoryModal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoriesTabProps {
  onEdit: (category: CategoryDto) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  onEdit,
  refreshTrigger,
  onRefresh,
}) => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data: any = await catalogService.getCategories();
      // Handle both direct array or paginated response with .items
      setCategories(Array.isArray(data) ? data : (data?.items || []));
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await catalogService.deleteCategory(id);
      toast.success("Đã xóa danh mục thành công!");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete category", error);
      toast.error("Không thể xóa danh mục này. Vui lòng thử lại!");
    } finally {
      setDeletingId(null);
      setCategoryToDelete(null);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-gray-500 font-bold text-sm">Đang tải danh sách danh mục...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-150 rounded-2xl bg-white max-w-xl mx-auto my-8">
        <Sparkles className="w-10 h-10 text-primary/40 mb-3 animate-pulse" />
        <h4 className="text-base font-black text-gray-800">Chưa có danh mục nào</h4>
        <p className="text-gray-400 text-xs font-semibold max-w-xs mt-1">
          Hãy click nút [+ Thêm Danh mục] để phân nhóm cho Sản phẩm & Dịch vụ của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Tên Danh Mục
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Mô tả
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                Thứ Tự
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Trạng Thái
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                {/* Name */}
                <td className="px-6 py-4.5">
                  <p className="text-sm font-black text-gray-900 tracking-tight">
                    {category.name}
                  </p>
                </td>

                {/* Description */}
                <td className="px-6 py-4.5 max-w-xs truncate">
                  <span className="text-xs font-semibold text-gray-500">
                    {category.description || "-"}
                  </span>
                </td>

                {/* Sort Order */}
                <td className="px-6 py-4.5 text-center">
                  <span className="text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                    {category.sortOrder}
                  </span>
                </td>

                {/* Active Status Badge */}
                <td className="px-6 py-4.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      category.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-gray-50 text-gray-400 border border-gray-200/60"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        category.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {category.isActive ? "Hiển thị" : "Ẩn"}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 rounded-lg hover:bg-primary/5 hover:text-primary text-gray-400 transition-colors"
                      title="Chỉnh sửa danh mục"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(category)}
                      disabled={deletingId === category.id}
                      className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors disabled:opacity-50"
                      title="Xóa danh mục"
                    >
                      {deletingId === category.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}" không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => categoryToDelete?.id && handleDelete(categoryToDelete.id)}
              disabled={!!deletingId}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
