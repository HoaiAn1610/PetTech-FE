import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { InventoryTab } from "@/features/clinic/inventory/InventoryTab";
import "@/styles/fonts.css";

export default function InventoryPage() {
  return (
    <ClinicPageShell
      title="Quản lý kho hàng"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Kho hàng" },
      ]}
      hideHeader
    >
      <div className="flex flex-col gap-6">
        {/* Page header section */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="text-gray-900"
              style={{ fontSize: "1.4rem", fontWeight: 900, letterSpacing: "-0.025em" }}
            >
              Nhật ký biến động kho 📦
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
              Theo dõi chi tiết lịch sử nhập xuất, ghi nhận số lượng biến động và điều chỉnh hao hụt tồn kho sản phẩm, vật tư y tế trong thời gian thực.
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl flex-shrink-0"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>
              Đang đồng bộ trực tiếp
            </span>
          </div>
        </div>

        {/* Main inventory table component */}
        <InventoryTab />
      </div>
    </ClinicPageShell>
  );
}

