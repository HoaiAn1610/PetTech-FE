import { useState } from "react";
import {
  Settings, Server, Mail, MessageSquare, Bell,
  Shield, Globe, Zap, CheckCircle2, AlertTriangle,
  Lock, ToggleLeft, ToggleRight, RefreshCw, Save,
  Database, Activity, Clock,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader } from "@/components/admin/AdminWidgets";
import "@/styles/fonts.css";

function Toggle({ on, onToggle, label, sub, disabled }: {
  on: boolean; onToggle: () => void; label: string; sub?: string; disabled?: boolean;
}) {
  return (
    <button onClick={() => !disabled && onToggle()} className="flex items-center gap-3 w-full text-left" style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <div className="relative flex-shrink-0 rounded-full transition-all duration-300" style={{ width: "44px", height: "24px", background: on ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "rgba(0,0,0,0.12)", border: on ? "2px solid rgba(37,99,235,0.4)" : "2px solid rgba(0,0,0,0.08)" }}>
        <div className="absolute top-0.5 rounded-full transition-all duration-300" style={{ width: "16px", height: "16px", background: "white", left: on ? "20px" : "2px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: on ? "#111827" : "#6b7280" }}>{label}</p>
        {sub && <p style={{ fontSize: "0.66rem", color: "#9ca3af", lineHeight: 1.4 }}>{sub}</p>}
      </div>
    </button>
  );
}

function SettingsSection({ icon: Icon, title, iconColor, children }: {
  icon: React.ElementType; title: string; iconColor: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fafafa" }}>
        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export default function AdminSystemPage() {
  const [saved, setSaved] = useState(false);
  const [flags, setFlags] = useState({
    maintenanceMode: false,
    signupsEnabled:  true,
    trialEnabled:    true,
    emailVerification: true,
    twoFactor:       false,
    autoBackup:      true,
    webhooksEnabled: true,
    rateLimiting:    true,
    debugLogs:       false,
  });

  const toggle = (key: keyof typeof flags) => setFlags(f => ({ ...f, [key]: !f[key] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <AdminPageShell title="Hệ thống" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Hệ thống" }]}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Cài đặt hệ thống</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Cấu hình nền tảng toàn cầu · Chỉ Super Admin mới có thể thay đổi</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", fontSize: "0.72rem", fontWeight: 700, color: "#16a34a" }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu!
            </span>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
            <Save className="w-3.5 h-3.5" /> Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Maintenance mode banner */}
      {flags.maintenanceMode && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.2)" }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#dc2626" }} />
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626" }}>Chế độ bảo trì đang BẬT</p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "1px" }}>Người dùng không thể đăng nhập. Tắt ngay sau khi hoàn tất bảo trì.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <SettingsSection icon={Globe} title="Truy cập nền tảng" iconColor="#2563EB">
          <div className="flex flex-col gap-5">
            <Toggle on={flags.maintenanceMode} onToggle={() => toggle("maintenanceMode")} label="Chế độ bảo trì" sub="Chặn tất cả đăng nhập của tenant trong khi bảo trì" />
            <Toggle on={flags.signupsEnabled} onToggle={() => toggle("signupsEnabled")} label="Đăng ký mở" sub="Cho phép đăng ký tài khoản tenant mới" />
            <Toggle on={flags.trialEnabled} onToggle={() => toggle("trialEnabled")} label="Dùng thử miễn phí" sub="Cho phép thời gian dùng thử 14 ngày khi đăng ký mới" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Shield} title="Bảo mật" iconColor="#7c3aed">
          <div className="flex flex-col gap-5">
            <Toggle on={flags.emailVerification} onToggle={() => toggle("emailVerification")} label="Xác minh email" sub="Yêu cầu xác minh email khi đăng ký mới" />
            <Toggle on={flags.twoFactor} onToggle={() => toggle("twoFactor")} label="Bắt buộc 2FA cho Admin" sub="Yêu cầu xác thực 2 yếu tố cho tất cả người dùng admin" />
            <Toggle on={flags.rateLimiting} onToggle={() => toggle("rateLimiting")} label="Giới hạn tốc độ API" sub="Áp dụng giới hạn tốc độ theo tenant để bảo vệ hệ thống" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Database} title="Dữ liệu & Sao lưu" iconColor="#16a34a">
          <div className="flex flex-col gap-5">
            <Toggle on={flags.autoBackup} onToggle={() => toggle("autoBackup")} label="Sao lưu tự động" sub="Sao lưu toàn bộ DB hàng ngày lúc 2:00 SA UTC" />
            <Toggle on={flags.debugLogs} onToggle={() => toggle("debugLogs")} label="Nhật ký debug" sub="Bật nhật ký chi tiết — chỉ dùng khi khắc phục sự cố" />
          </div>
        </SettingsSection>

        <SettingsSection icon={Zap} title="Tích hợp" iconColor="#f97316">
          <div className="flex flex-col gap-5">
            <Toggle on={flags.webhooksEnabled} onToggle={() => toggle("webhooksEnabled")} label="Webhook" sub="Bật gửi webhook đến endpoint của tenant" />
            <Toggle on={flags.emailVerification} onToggle={() => toggle("emailVerification")} label="Email qua SES" sub="Dùng AWS SES để gửi email transactional" disabled />
          </div>
        </SettingsSection>
      </div>

      {/* System info */}
      <AdminCard>
        <AdminCardHeader title="Thông tin hệ thống" />
        <div className="grid grid-cols-4 gap-6">
          {[
            { icon: Activity, label: "Phiên bản ứng dụng", value: "v3.14.2",      color: "#2563EB" },
            { icon: Database, label: "PostgreSQL",          value: "15.3",          color: "#16a34a" },
            { icon: Server,   label: "Node.js",             value: "20.11.0 LTS",   color: "#f97316" },
            { icon: Clock,    label: "Uptime",              value: "47 ngày 6 giờ", color: "#7c3aed" },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 600 }}>{item.label}</p>
                  <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

    </AdminPageShell>
  );
}
