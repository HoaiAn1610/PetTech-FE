import { useState, useEffect } from "react";
import {
  Server, ShieldAlert, CheckCircle2, Save, RefreshCw,
  Sliders, Info, Mail, Database, HardDrive
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useSystemSettings, useUpdateSystemSettings } from "@/hooks/admin/useSystem";
import { toast } from "sonner";
import "@/styles/fonts.css";

interface SystemSettingsState {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  supportEmail: string;
  backupFrequencyHours: number;
  maxStorageLimitGb: number;
}

const DEFAULT_SETTINGS: SystemSettingsState = {
  maintenanceMode: false,
  allowNewRegistrations: true,
  supportEmail: "support@pettech.io",
  backupFrequencyHours: 24,
  maxStorageLimitGb: 50,
};

function SystemContent() {
  const { data: configs, isLoading, refetch, isRefetching } = useSystemSettings();
  const updateMutation = useUpdateSystemSettings();
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<SystemSettingsState>(DEFAULT_SETTINGS);

  // Map backend key-value configs to structured state
  useEffect(() => {
    if (configs && Array.isArray(configs)) {
      const newSettings = { ...DEFAULT_SETTINGS };
      
      configs.forEach(c => {
        const val = c.value;
        switch (c.key) {
          case "MaintenanceMode":
            newSettings.maintenanceMode = val === "true";
            break;
          case "AllowNewRegistrations":
            newSettings.allowNewRegistrations = val !== "false"; // default true
            break;
          case "SupportEmail":
            newSettings.supportEmail = val || DEFAULT_SETTINGS.supportEmail;
            break;
          case "BackupFrequencyHours":
            newSettings.backupFrequencyHours = Number(val) || DEFAULT_SETTINGS.backupFrequencyHours;
            break;
          case "MaxStorageLimitGb":
            newSettings.maxStorageLimitGb = Number(val) || DEFAULT_SETTINGS.maxStorageLimitGb;
            break;
        }
      });
      
      setSettings(newSettings);
    }
  }, [configs]);

  const updateSetting = <K extends keyof SystemSettingsState>(k: K, val: SystemSettingsState[K]) => {
    setSettings(s => ({ ...s, [k]: val }));
  };

  async function handleSaveChanges() {
    setIsSaving(true);
    try {
      // We will perform upsert for all 5 settings sequentially or concurrently
      const payloads = [
        { key: "MaintenanceMode", value: String(settings.maintenanceMode), group: "General", description: "Bật chế độ bảo trì toàn hệ thống" },
        { key: "AllowNewRegistrations", value: String(settings.allowNewRegistrations), group: "General", description: "Cho phép mở đăng ký cửa hàng mới" },
        { key: "SupportEmail", value: settings.supportEmail, group: "General", description: "Email hỗ trợ vận hành hệ thống" },
        { key: "BackupFrequencyHours", value: String(settings.backupFrequencyHours), group: "Operations", description: "Tần suất tự động sao lưu dữ liệu (giờ)" },
        { key: "MaxStorageLimitGb", value: String(settings.maxStorageLimitGb), group: "Operations", description: "Giới hạn dung lượng tệp tải lên tối đa (GB)" },
      ];

      // Call mutation for each setting
      await Promise.all(payloads.map(payload => updateMutation.mutateAsync(payload)));
      
      toast.success("Đã cập nhật toàn bộ cấu hình hệ thống thành công!");
      refetch();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu cấu hình!");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5">
        <SkeletonCard lines={4} />
        <SkeletonCard lines={4} />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Cài đặt Nền tảng</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            Cấu hình các thông số toàn cục và trạng thái hoạt động hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 transition-colors border"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
            title="Làm mới">
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:-translate-y-px transition-all font-bold"
            style={{
              background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
              color: "white",
              fontSize: "0.82rem",
              boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              opacity: isSaving ? 0.7 : 1
            }}>
            <Save className="w-4 h-4" /> {isSaving ? "Đang lưu cấu hình…" : "Lưu cài đặt"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* General Settings */}
        <AdminCard>
          <AdminCardHeader
            title="Cấu hình hệ thống chung"
            action={<Sliders className="w-4 h-4 text-gray-400" />}
          />
          <div className="flex flex-col gap-6 py-2">
            {/* Maintenance Mode */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>Chế độ Bảo trì (Maintenance Mode)</span>
                  {settings.maintenanceMode && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", fontSize: "0.58rem" }}>KÍCH HOẠT</span>
                  )}
                </div>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "3px" }}>
                  Khi kích hoạt, toàn bộ cổng giao diện của các Tenant và Khách hàng sẽ tạm dừng và hiển thị thông báo bảo trì kỹ thuật. Super Admin vẫn truy cập bình thường.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting("maintenanceMode", !settings.maintenanceMode)}
                className="w-11 h-6 rounded-full transition-colors relative flex items-center outline-none flex-shrink-0"
                style={{
                  background: settings.maintenanceMode ? "#dc2626" : "#e5e7eb",
                  border: "1px solid rgba(0,0,0,0.05)"
                }}>
                <span
                  className="w-5 h-5 rounded-full bg-white absolute transition-transform"
                  style={{
                    transform: settings.maintenanceMode ? "translateX(20px)" : "translateX(2px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </button>
            </div>

            <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

            {/* Allow New Registrations */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>Cho phép mở Đăng ký mới</span>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "3px" }}>
                  Bật/tắt biểu mẫu đăng ký dịch vụ của khách hàng/Tenant trên trang chủ Landing Page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting("allowNewRegistrations", !settings.allowNewRegistrations)}
                className="w-11 h-6 rounded-full transition-colors relative flex items-center outline-none flex-shrink-0"
                style={{
                  background: settings.allowNewRegistrations ? "#16a34a" : "#e5e7eb",
                  border: "1px solid rgba(0,0,0,0.05)"
                }}>
                <span
                  className="w-5 h-5 rounded-full bg-white absolute transition-transform"
                  style={{
                    transform: settings.allowNewRegistrations ? "translateX(20px)" : "translateX(2px)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                  }}
                />
              </button>
            </div>

            <div style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

            {/* Support Email */}
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>
                <Mail className="w-4 h-4 text-gray-400" /> Email hỗ trợ nền tảng
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={e => updateSetting("supportEmail", e.target.value)}
                placeholder="support@pettech.io"
                className="px-3.5 py-2 rounded-xl outline-none"
                style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#111827" }}
              />
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Email nhận các phản hồi kỹ thuật toàn cục và liên hệ vận hành.</p>
            </div>
          </div>
        </AdminCard>

        {/* Operating & Storage Settings */}
        <div className="flex flex-col gap-6">
          <AdminCard>
            <AdminCardHeader
              title="Vận hành & Tài nguyên"
              action={<Database className="w-4 h-4 text-gray-400" />}
            />
            <div className="flex flex-col gap-5 py-2">
              {/* Backup Frequency */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>
                  <HardDrive className="w-4 h-4 text-gray-400" /> Tần suất sao lưu hệ thống (Giờ)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={settings.backupFrequencyHours}
                  onChange={e => updateSetting("backupFrequencyHours", Number(e.target.value) || 24)}
                  className="px-3.5 py-2 rounded-xl outline-none"
                  style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#111827" }}
                />
                <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Số giờ giãn cách giữa mỗi chu kỳ tự động sao lưu Snapshot cơ sở dữ liệu.</p>
              </div>

              {/* Max Storage Limit */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151" }}>
                  <Server className="w-4 h-4 text-gray-400" /> Giới hạn lưu trữ tệp tin tối đa (GB)
                </label>
                <input
                  type="number"
                  min={5}
                  max={2000}
                  value={settings.maxStorageLimitGb}
                  onChange={e => updateSetting("maxStorageLimitGb", Number(e.target.value) || 50)}
                  className="px-3.5 py-2 rounded-xl outline-none"
                  style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#111827" }}
                />
                <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>Không gian lưu trữ hình ảnh, hồ sơ bệnh án tối đa cấp phát mặc định cho mỗi Tenant.</p>
              </div>
            </div>
          </AdminCard>

          {/* Tips Info Panel */}
          <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)" }}>
            <Info className="w-4.5 h-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e3a8a" }}>Lời khuyên kỹ thuật</p>
              <p style={{ fontSize: "0.68rem", color: "#2563EB", marginTop: "2px", lineHeight: 1.5 }}>
                Tất cả thay đổi cấu hình hệ thống chung sẽ tác động trực tiếp và lập tức tới máy chủ. Hãy cân nhắc kỹ trước khi bật chế độ bảo trì.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminSystemPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell
        title="Hệ thống"
        breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Cài đặt hệ thống" }]}>
        <SystemContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
