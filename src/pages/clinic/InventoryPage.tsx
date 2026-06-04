import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { InventoryTab } from "@/features/clinic/inventory/InventoryTab";
import "@/styles/fonts.css";

export default function InventoryPage() {
  const HeaderActions = (
    <div
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl flex-shrink-0"
      style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
    >
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>
        Đang đồng bộ trực tiếp
      </span>
    </div>
  );

  return (
    <ClinicPageShell
      title="Quản lý kho hàng"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Kho hàng" },
      ]}
      headerActions={HeaderActions}
    >
      <div className="flex flex-col gap-6">
        {/* Main inventory table component */}
        <InventoryTab />
      </div>
    </ClinicPageShell>
  );
}

