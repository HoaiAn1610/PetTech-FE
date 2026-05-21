import { useNavigate } from "react-router";
import {
  Users, CreditCard, TrendingUp, TrendingDown, Activity,
  AlertCircle, CheckCircle2, ArrowUpRight, BarChart3,
  ChevronRight, ShieldCheck, Database, Server, Globe, Wifi,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useOverviewKPIs, useRecentActivity } from "@/hooks/admin/useOverview";
import { useTenants } from "@/hooks/admin/useTenants";
import type { LogEventType } from "@/types/admin";
import "@/styles/fonts.css";

const LOG_ICON: Record<LogEventType, typeof Users> = {
  Auth:    ShieldCheck,
  Tenant:  Users,
  Billing: CreditCard,
  Plan:    TrendingUp,
  Support: AlertCircle,
  System:  Server,
};

const LOG_COLOR: Record<LogEventType, string> = {
  Auth:    "#7c3aed",
  Tenant:  "#2563EB",
  Billing: "#dc2626",
  Plan:    "#16a34a",
  Support: "#f97316",
  System:  "#06b6d4",
};

const PLAN_COLORS: Record<string, string> = {
  Enterprise: "#7c3aed",
  Growth:     "#2563EB",
  Starter:    "#9ca3af",
  Trial:      "#f97316",
};

const AVATAR_COLORS = ["#2563EB", "#16a34a", "#7c3aed", "#f97316", "#06b6d4"];

function formatTimeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} giờ trước`;
  return `${Math.floor(diffH / 24)} ngày trước`;
}

function OverviewContent() {
  const navigate = useNavigate();
  const { data: kpis, isLoading: kpisLoading } = useOverviewKPIs();
  const { data: activity = [], isLoading: activityLoading } = useRecentActivity();
  const { data: tenantsData, isLoading: tenantsLoading } = useTenants({ page: 1, pageSize: 5 });

  const recentTenants = tenantsData?.items ?? [];
  const mrrTrend = kpis?.mrrTrend ?? [];

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

      {/* KPI strip */}
      {kpisLoading ? (
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <AdminKPICard label="MRR" value={`$${((kpis?.mrr ?? 0) / 1000).toFixed(1)}k`} sub={`+${kpis?.mrrGrowth ?? 0}% so tháng trước`} icon={CreditCard} color="#2563EB" bg="rgba(37,99,235,0.08)" trend={`+${kpis?.mrrGrowth ?? 0}%`} trendUp />
          <AdminKPICard label="Tenant hoạt động" value={String(kpis?.activeTenants ?? 0)} sub={`+${kpis?.activeTenantsGrowth ?? 0} tháng này`} icon={Users} color="#16a34a" bg="rgba(22,163,74,0.08)" trend={`+${kpis?.activeTenantsGrowth ?? 0}`} trendUp />
          <AdminKPICard label="ARR" value={`$${(((kpis?.mrr ?? 0) * 12) / 1000).toFixed(0)}k`} sub="Dự kiến ARR năm" icon={TrendingUp} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
          <AdminKPICard label="ARPU" value={`$${kpis?.arpu ?? 0}`} sub={`+${kpis?.arpuGrowth ?? 0}% tháng trước`} icon={BarChart3} color="#f97316" bg="rgba(249,115,22,0.08)" trend={`+${kpis?.arpuGrowth ?? 0}%`} trendUp />
          <AdminKPICard label="Tỷ lệ rời bỏ" value={`${kpis?.churnRate ?? 0}%`} sub="Tháng này" icon={TrendingDown} color="#dc2626" bg="rgba(220,38,38,0.07)" />
          <AdminKPICard label="Phiếu hỗ trợ mở" value={String(kpis?.openTickets ?? 0)} sub="Cần xử lý" icon={AlertCircle} color="#ea580c" bg="rgba(249,115,22,0.07)" />
        </div>
      )}

      {/* MRR Chart + Activity */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
          <AdminCardHeader title="Tăng trưởng MRR" subtitle="Doanh thu định kỳ hàng tháng" />
          {kpisLoading ? <SkeletonCard lines={4} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mrrTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminMrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]} contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.78rem" }} />
                <Area name="MRR" type="monotone" dataKey="mrr" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminMrrGrad)" dot={{ fill: "#2563EB", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="Hoạt động gần đây" />
          {activityLoading ? <SkeletonCard lines={5} /> : (
            <div className="flex flex-col gap-3">
              {activity.slice(0, 8).map((item) => {
                const Icon = LOG_ICON[item.type] ?? Activity;
                const color = LOG_COLOR[item.type] ?? "#9ca3af";
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}12` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.4 }}>{item.action}</p>
                      <p style={{ fontSize: "0.6rem", color: "#9ca3af", marginTop: "2px" }}>{formatTimeAgo(item.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <p className="py-4 text-center" style={{ fontSize: "0.78rem", color: "#9ca3af" }}>Chưa có hoạt động nào.</p>
              )}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Recent Signups + System Health */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
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
                  {["Phòng khám", "Gói", "Trạng thái", "Ngày đăng ký", ""].map(h => (
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
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{t.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-lg" style={{ background: t.plan === "Enterprise" ? "rgba(124,58,237,0.08)" : t.plan === "Growth" ? "rgba(37,99,235,0.08)" : "rgba(0,0,0,0.05)", fontSize: "0.68rem", fontWeight: 700, color: PLAN_COLORS[t.plan] ?? "#6b7280" }}>
                          {t.plan}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive ? "#16a34a" : "#f97316" }} />
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: isActive ? "#16a34a" : "#ea580c" }}>{isActive ? "Hoạt động" : t.status === "Trial" ? "Dùng thử" : t.status}</span>
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
                  <tr><td colSpan={5} className="py-6 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có tenant nào.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="Tình trạng hệ thống" action={
            <button onClick={() => navigate("/admin/system")} style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>Chi tiết →</button>
          } />
          <div className="flex flex-col gap-2.5">
            {[
              { name: "API Gateway",    icon: Globe,     status: "operational" },
              { name: "Database",       icon: Database,  status: "operational" },
              { name: "Auth Service",   icon: ShieldCheck, status: "operational" },
              { name: "Storage",        icon: Server,    status: "operational" },
              { name: "WebSocket",      icon: Wifi,      status: "operational" },
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
      </div>
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
