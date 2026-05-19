import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Loader2, Sparkles, Clock, AlertTriangle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { ServiceDto } from "./ServiceModal";

interface ServicesTabProps {
  onEdit: (service: ServiceDto) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  onEdit,
  refreshTrigger,
  onRefresh,
}) => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await axiosInstance.get("/api/shop/services");
      // Result<T> is automatically unwrapped by interceptor
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [refreshTrigger]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${name}" không?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/shop/services/${id}`);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete service", error);
      alert("Không thể xóa dịch vụ này. Vui lòng thử lại!");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-gray-500 font-bold text-sm">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-150 rounded-2xl bg-white max-w-xl mx-auto my-8">
        <Sparkles className="w-10 h-10 text-indigo-300 mb-3 animate-pulse" />
        <h4 className="text-base font-black text-gray-800">Chưa có dịch vụ nào</h4>
        <p className="text-gray-400 text-xs font-semibold max-w-xs mt-1">
          Hãy click nút [+ Thêm Dịch vụ] để thêm dịch vụ đầu tiên cho phòng khám của bạn.
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
                Dịch Vụ
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Phân Loại
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Giá Tiền
              </th>
              <th className="px-6 py-4.5 text-xs font-black text-gray-400 uppercase tracking-widest">
                Thời Lượng
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
            {services.map((service) => (
              <tr
                key={service.id}
                className="hover:bg-gray-50/40 transition-colors duration-150"
              >
                {/* Name & Emoji */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border border-black/5"
                      style={{
                        backgroundColor: `${service.color || "#4f46e5"}15`,
                        color: service.color || "#4f46e5",
                      }}
                    >
                      {service.emoji || "🐾"}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 tracking-tight">
                        {service.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4.5">
                  <span className="text-xs font-bold text-gray-500 bg-gray-100/60 px-2.5 py-1 rounded-lg">
                    {service.category || "Dịch vụ chung"}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4.5">
                  <span className="text-sm font-black text-indigo-650">
                    {formatPrice(service.price)}
                  </span>
                </td>

                {/* Duration */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-4 h-4 stroke-2" />
                    <span className="text-xs font-bold">
                      {service.durationMinutes} phút
                    </span>
                  </div>
                </td>

                {/* Active Status Badge */}
                <td className="px-6 py-4.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      service.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-gray-50 text-gray-400 border border-gray-200/60"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        service.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {service.isActive ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="px-6 py-4.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(service)}
                      className="p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors"
                      title="Chỉnh sửa dịch vụ"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => service.id && handleDelete(service.id, service.name)}
                      disabled={deletingId === service.id}
                      className="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors disabled:opacity-50"
                      title="Xóa dịch vụ"
                    >
                      {deletingId === service.id ? (
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
    </div>
  );
};
export default ServicesTab;
