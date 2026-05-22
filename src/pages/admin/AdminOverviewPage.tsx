import { useNavigate } from "react-router";
import {
  Users, AlertCircle, CheckCircle2, ArrowUpRight,
  ChevronRight, ShieldCheck, Database, Server, Globe, Wifi,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useOverviewTenants, useOverviewTickets, useRecentTenants, useRecentTickets } from "@/hooks/admin/useOverview";
import "@/styles/fonts.css";

const AVATAR_COLORS = ["#2563EB", "#16a34a", "#7c3aed", "#f97316", "#06b6d4"];

const TICKET_PRIORITY_COLOR: Record<string, string> = {
  High: "#dc2626", Medium: "#f97316", Low: "#6b7280",
};

function OverviewContent() {
  const navigate = useNavigate();
  const { data: tenantsCount, isLoading: tenantsCountLoading } = useOverviewTenants();
  const { data: ticketsCount, isLoading: ticketsCountLoading } = useOverviewTickets();
  const { data: recentTenantsData, isLoading: tenantsLoading } = useRecentTenants();
  const { data: recentTicketsData, isLoading: ticketsLoading } = useRecentTickets();

  const recentTenants = recentTenantsData?.items ?? [];
  const recentTickets = recentTicketsData?.items ?? [];

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Tổng quan nền tảng</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>Tất cả hệ thống hoạt động</span>
          </div>
          <button
            onClick={() => navigate("/admin/tenants")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
          >
            <Users className="w-3.5 h-3.5" /> Quản lý Tenant
          </button>
        </div>
      </div>

      {/* KPI strip — derived from real endpoints */}
      <div className="grid grid-cols-3 gap-4">
        {tenantsCountLoading ? <SkeletonCard lines={2} /> : (
          <AdminKPICard
            label="Tổng số Tenant"
            value={String(tenantsCount?.totalCount ?? 0)}
            sub="Đang sử dụng nền tảng"
            icon={Users}
            color="#16a34a"
            bg="rgba(22,163,74,0.08)"
          />
        )}
        {ticketsCountLoading ? <SkeletonCard lines={2} /> : (
          <AdminKPICard
            label="Phiếu hỗ trợ mở"
            value={String(ticketsCount?.totalCount ?? 0)}
            sub="Cần xử lý"
            icon={AlertCircle}
            color="#ea580c"
            bg="rgba(249,115,22,0.07)"
          />
        )}
        <AdminKPICard
          label="Trạng thái hệ thống"
          value="Bình thường"
          sub="Tất cả dịch vụ hoạt động"
          icon={CheckCircle2}
          color="#16a34a"
          bg="rgba(22,163,74,0.08)"
        />
      </div>

      {/* Recent Tenants + Recent Tickets */}
      <div className="grid grid-cols-2 gap-5">
        <AdminCard>
          <AdminCardHeader
            title="Tenant đăng ký gần đây"
            action={
              <button onClick={() => navigate("/admin/tenants")} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          {tenantsLoading ? <SkeletonCard lines={4} /> : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["Phòng khám", "Trạng thái", "Ngày đăng ký", ""].map(h => (
                    <th key={h} className="pb-2.5 text-left" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTenants.map((t, i) => {
                  const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  const isActive = t.status === "Active";
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate("/admin/tenants")} style={{ borderBottom: i < recentTenants.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: 800, color }}>{initials}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                            {t.email && <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{t.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? "#16a34a" : "#f97316" }} />
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: isActive ? "#16a34a" : "#ea580c" }}>
                            {isActive ? "Hoạt động" : t.status ?? "—"}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{new Date(t.createdAt).toLocaleDateString("vi-VN")}</span>
                      </td>
                      <td className="py-3">
                        <ChevronRight className="w-4 h-4" style={{ color: "#d1d5db" }} />
                      </td>
                    </tr>
                  );
                })}
                {recentTenants.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có tenant nào.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader
            title="Phiếu hỗ trợ gần đây"
            action={
              <button onClick={() => navigate("/admin/support")} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          {ticketsLoading ? <SkeletonCard lines={4} /> : (
            <div className="flex flex-col gap-2">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => navigate("/admin/support")}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(249,115,22,0.08)" }}>
                    <AlertCircle className="w-3.5 h-3.5" style={{ color: TICKET_PRIORITY_COLOR[ticket.priority] ?? "#9ca3af" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ticket.subject}</p>
                    <p style={{ fontSize: "0.62rem", color: "#9ca3af", marginTop: "1px" }}>
                      {ticket.tenantName} · {new Date(ticket.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0" style={{ background: `${TICKET_PRIORITY_COLOR[ticket.priority] ?? "#9ca3af"}15`, color: TICKET_PRIORITY_COLOR[ticket.priority] ?? "#9ca3af", fontSize: "0.6rem" }}>
                    {ticket.priority}
                  </span>
                </div>
              ))}
              {recentTickets.length === 0 && (
                <p className="py-4 text-center" style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Không có phiếu hỗ trợ nào.</p>
              )}
            </div>
          )}
        </AdminCard>
      </div>

      {/* System Health — static display */}
      <AdminCard>
        <AdminCardHeader title="Tình trạng hệ thống" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "API Gateway",    icon: Globe,       status: "operational" },
            { name: "Database",       icon: Database,    status: "operational" },
            { name: "Auth Service",   icon: ShieldCheck, status: "operational" },
            { name: "Storage",        icon: Server,      status: "operational" },
            { name: "WebSocket",      icon: Wifi,        status: "operational" },
            { name: "Email Service",  icon: CheckCircle2, status: "operational" },
          ].map((s, i) => {
            const Icon = s.icon;
            const ok = s.status === "operational";
            return (
              <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl" style={{ background: ok ? "rgba(22,163,74,0.04)" : "rgba(249,115,22,0.06)", border: `1px solid ${ok ? "rgba(22,163,74,0.12)" : "rgba(249,115,22,0.2)"}` }}>
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: ok ? "#16a34a" : "#f97316" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{s.name}</span>
                </div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: ok ? "#16a34a" : "#f97316" }}>
                  {ok ? "Bình thường" : "Gián đoạn"}
                </span>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </>
  );
}

export default function AdminOverviewPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Tổng quan" breadcrumbs={[{ label: "Cổng quản trị" }, { label: "Tổng quan" }]}>
        <OverviewContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
