import { BarChart3 } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import "@/styles/fonts.css";

function AnalyticsContent() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.08)" }}>
        <BarChart3 className="w-8 h-8" style={{ color: "#7c3aed" }} />
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Phân tích nền tảng</h3>
      <p style={{ fontSize: "0.82rem", color: "#9ca3af", textAlign: "center", maxWidth: 360 }}>
        Tính năng này đang được phát triển. Dữ liệu phân tích DAU, MAU và session sẽ sớm được tích hợp.
      </p>
      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(249,115,22,0.1)", color: "#ea580c" }}>
        Sắp ra mắt
      </span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Phân tích" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Phân tích" }]}>
        <AnalyticsContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
