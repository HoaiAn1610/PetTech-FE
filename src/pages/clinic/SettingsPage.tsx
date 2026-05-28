import { useState } from "react";
import {
  Building2, Bell, Lock, CreditCard, Plug, Users, ChevronRight,
} from "lucide-react";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicProfile } from "@/features/clinic/settings/ClinicProfile";
import { NotificationSettings } from "@/features/clinic/settings/NotificationSettings";
import { SecuritySettings } from "@/features/clinic/settings/SecuritySettings";
import { IntegrationsSettings } from "@/features/clinic/settings/IntegrationsSettings";
import "@/styles/fonts.css";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type SettingsTab = "clinic" | "notifications" | "security" | "integrations";

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<any> }[] = [
  { id: "clinic",        label: "Hồ sơ phòng khám", icon: Building2  },
  { id: "notifications", label: "Thông báo",          icon: Bell       },
  { id: "security",      label: "Bảo mật",            icon: Lock       },
  { id: "integrations",  label: "Tích hợp",           icon: Plug       },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("clinic");

  return (
    <ClinicPageShell
      title="Cài đặt"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Cài đặt" }]}
      maxWidth="max-w-6xl"
      noPadding
    >
      <div className="flex h-full min-h-[calc(100vh-140px)]">
        {/* Settings Sub-Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white border-r overflow-y-auto py-6 px-4"
          style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <p className="px-3 mb-3" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.08em" }}>CÀI ĐẶT HỆ THỐNG</p>
          <nav className="flex flex-col gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left transition-all group"
                  style={{ background: active ? "rgba(37,99,235,0.08)" : "transparent", color: active ? "#2563EB" : "#6b7280" }}>
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? "#2563EB" : "#9ca3af" }} />
                  <span style={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color: "#2563EB" }} />}
                </button>
              );
            })}
          </nav>
          <div className="mt-6 mx-3 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <a href="/clinic/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left hover:bg-orange-50 transition-colors group"
              style={{ textDecoration: "none" }}>
              <CreditCard className="w-4 h-4" style={{ color: "#f97316" }} />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f97316" }}>Thanh toán & Gói</span>
            </a>
          </div>
        </div>

        {/* Main Settings Content */}
        <main className="flex-1 overflow-y-auto px-10 py-8" style={{ background: "#f8fafc" }}>
          <div className="max-w-3xl">
            <div className="mb-6">
              <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
                {TABS.find(t => t.id === activeTab)?.label}
              </h1>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
                Quản lý các thiết lập và cấu hình cho {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} của bạn.
              </p>
            </div>

            <div className="animate-in fade-in duration-300">
              {activeTab === "clinic" && <ClinicProfile />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "integrations" && <IntegrationsSettings />}
            </div>
          </div>
        </main>
      </div>
    </ClinicPageShell>
  );
}

