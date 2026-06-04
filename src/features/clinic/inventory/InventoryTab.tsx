import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, Plus, TrendingUp, TrendingDown, ShieldAlert } from "lucide-react";
import { inventoryService } from "@/api/services";
import { toast } from "sonner";
import { InventoryModal } from "./InventoryModal";
import { format } from "date-fns";

export interface InventoryHistoryDto {
  id: string;
  productId: string;
  productName?: string;
  movementType: "IN" | "OUT" | "ADJUST";
  quantity: number;
  performedByName?: string;
  notes?: string;
  createdAt: string;
}

export const InventoryTab: React.FC = () => {
  const [history, setHistory] = useState<InventoryHistoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data: any = await inventoryService.getMovements();
      const items = Array.isArray(data) ? data : data?.items || [];
      // Sort by newest first just in case
      items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(items);
    } catch (error) {
      console.error("Failed to fetch inventory history", error);
      toast.error("Không thể tải lịch sử biến động kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "IN":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-wider border border-emerald-100">
            <TrendingUp className="w-3.5 h-3.5" />
            Nhập kho
          </span>
        );
      case "OUT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-black uppercase tracking-wider border border-gray-200">
            <TrendingDown className="w-3.5 h-3.5" />
            Xuất kho
          </span>
        );
      case "ADJUST":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-black uppercase tracking-wider border border-rose-100">
            <ShieldAlert className="w-3.5 h-3.5" />
            Hao hụt/Hủy
          </span>
        );
      default:
        return <span className="text-gray-500 font-bold">{type}</span>;
    }
  };

  const formatQuantity = (type: string, qty: number) => {
    if (type === "IN") return <span className="text-emerald-600 font-black">+{qty}</span>;
    if (type === "OUT" || type === "ADJUST") return <span className="text-rose-600 font-black">-{qty}</span>;
    return <span>{qty}</span>;
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            Lịch sử biến động
          </h3>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            Theo dõi thao tác nhập/xuất/hủy trên toàn bộ sản phẩm
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-2xl text-white font-black text-xs transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20 w-full sm:w-auto"
          style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB), color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, black))" }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Tạo Phiếu Kho
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-1">
        {loading && history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-gray-500 font-bold text-sm">Đang tải lịch sử kho...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-150 rounded-2xl bg-white max-w-xl mx-auto my-8">
            <Sparkles className="w-10 h-10 text-primary/40 mb-3 animate-pulse" />
            <h4 className="text-base font-black text-gray-800">Chưa có dữ liệu kho</h4>
            <p className="text-gray-400 text-xs font-semibold max-w-xs mt-1">
              Nhấn [+ Tạo Phiếu Kho] để ghi nhận giao dịch nhập/xuất kho đầu tiên.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  Ngày Giờ
                </th>
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Tên Sản Phẩm
                </th>
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Loại Biến Động
                </th>
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">
                  Số Lượng
                </th>
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Nhân Viên
                </th>
                <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                  Ghi Chú
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/40 transition-colors duration-150"
                >
                  <td className="px-6 py-4.5 whitespace-nowrap">
                    <p className="text-sm font-bold text-gray-700">
                      {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  </td>
                  <td className="px-6 py-4.5 max-w-[200px] truncate">
                    <p className="text-sm font-black text-gray-900 tracking-tight" title={item.productName || item.productId}>
                      {item.productName || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4.5">
                    {getMovementBadge(item.movementType)}
                  </td>
                  <td className="px-6 py-4.5 text-right text-base">
                    {formatQuantity(item.movementType, item.quantity)}
                  </td>
                  <td className="px-6 py-4.5">
                    <p className="text-sm font-bold text-gray-700">
                      {item.performedByName || "Hệ thống"}
                    </p>
                  </td>
                  <td className="px-6 py-4.5 max-w-[250px] truncate">
                    <span className="text-xs font-semibold text-gray-500" title={item.notes || "-"}>
                      {item.notes || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <InventoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
