import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Loader2, Sparkles, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { catalogService } from "@/api/services";
import { ProductDto } from "./ProductModal";
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

interface ProductsTabProps {
  onEdit: (product: ProductDto) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  onEdit,
  refreshTrigger,
  onRefresh,
}) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        catalogService.getProducts({ PageNumber: pageNumber, PageSize: 10 }),
        catalogService.getCategories({ PageSize: 100 })
      ]);
      
      const prodData: any = prodRes;
      const catData: any = catRes;
      
      if (Array.isArray(prodData)) {
        setProducts(prodData);
        setTotalCount(prodData.length);
        setTotalPages(Math.ceil(prodData.length / 10));
      } else {
        setProducts(prodData?.items || []);
        setTotalCount(prodData?.totalCount || 0);
        setTotalPages(prodData?.totalPages || 1);
        if (prodData?.totalPages && pageNumber > prodData.totalPages && prodData.totalPages > 0) {
          setPageNumber(prodData.totalPages);
        }
      }
      setCategories(Array.isArray(catData) ? catData : (catData?.items || []));
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger, pageNumber]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await catalogService.deleteProduct(id);
      toast.success("Đã xóa sản phẩm thành công!");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Không thể xóa sản phẩm này. Vui lòng thử lại!");
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Không xác định";
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-gray-500 font-bold text-sm">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-150 rounded-2xl bg-white max-w-xl mx-auto my-8">
        <Package className="w-10 h-10 text-primary/40 mb-3 animate-bounce" />
        <h4 className="text-base font-black text-gray-800">Chưa có sản phẩm nào</h4>
        <p className="text-gray-400 text-xs font-semibold max-w-xs mt-1">
          Hãy click nút [+ Thêm Sản phẩm] để bắt đầu bán hàng cho thú cưng.
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
                Tên Sản Phẩm
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Danh Mục
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Giá Bán
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">
                Tồn Kho
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
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                {/* Name */}
                <td className="px-6 py-4.5">
                  <p className="text-sm font-black text-gray-900 tracking-tight">
                    {product.name}
                  </p>
                </td>

                {/* Category */}
                <td className="px-6 py-4.5">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100/60 px-2.5 py-1 rounded-lg">
                    {getCategoryName(product.categoryId)}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4.5">
                  <span className="text-sm font-black text-primary">
                    {formatPrice(product.price)}
                  </span>
                </td>

                {/* Stock Qty */}
                <td className="px-6 py-4.5 text-center">
                  <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${
                    product.stockQty <= 5 
                      ? "bg-rose-50 text-rose-600 border-rose-200" 
                      : "bg-gray-50 text-gray-700 border-gray-100"
                  }`}>
                    {product.stockQty}
                  </span>
                </td>

                {/* Active Status Badge */}
                <td className="px-6 py-4.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-gray-50 text-gray-400 border border-gray-200/60"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        product.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {product.isActive ? "Đang bán" : "Ngừng bán"}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-lg hover:bg-primary/5 hover:text-primary text-gray-400 transition-colors"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      disabled={deletingId === product.id}
                      className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors disabled:opacity-50"
                      title="Xóa sản phẩm"
                    >
                      {deletingId === product.id ? (
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

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex items-center justify-between px-6 py-4.5 bg-gray-50/30 border-t border-gray-100">
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }} className="font-semibold">
            Trang {pageNumber} / {totalPages} · Tổng số {totalCount} sản phẩm
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(p => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-gray-100 transition-all border border-gray-200"
              style={{ color: "#374151" }}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Trước
            </button>
            <button
              disabled={pageNumber >= totalPages}
              onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-gray-100 transition-all border border-gray-200"
              style={{ color: "#374151" }}
            >
              Tiếp <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}" không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => productToDelete?.id && handleDelete(productToDelete.id)}
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
