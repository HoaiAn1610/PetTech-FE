import {
  Activity, Users, BarChart3, Clock, Zap,
  Globe, Smartphone, Monitor, ArrowUpRight,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { usePlatformAnalytics } from "@/hooks/admin/useAnalytics";
import "@/styles/fonts.css";

const PLATFORM_ICONS: Record<string, typeof Monitor> = {
  Desktop: Monitor,
  Mobile:  Smartphone,
  Tablet:  Globe,
};

const PLATFORM_LABELS: Record<string, string> = {
  Desktop: "Máy tính",
  Mobile:  "Mobile PWA",
  Tablet:  "Máy tính bảng",
};

const PLATFORM_COLORS = ["#2563EB", "#7c3aed", "#f97316", "#16a34a", "#06b6d4"];

function AnalyticsContent() {
  const { data: analytics, isLoading } = usePlatformAnalytics();

  const dauTrend = (analytics?.dauTrend ?? []).map(d => ({
    day:   new Date(d.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    dau:   d.value,
  }));

  const sessionTrend = (analytics?.sessionTrend ?? []).map(s => ({
    month: s.month,
    avg:   s.value,
  }));

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Thống kê nền tảng</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Dữ liệu sử dụng thực tế · Cập nhật mỗi 5 phút</p>
        </div>
      </div>

      {/* KPIs */}
      {isLoading ? (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          <AdminKPICard label="DAU"             value={String(analytics?.dau ?? 0)}                      sub="Người dùng hoạt động hôm nay"    icon={Users}    color="#2563EB" bg="rgba(37,99,235,0.08)" />
          <AdminKPICard label="MAU"             value={(analytics?.mau ?? 0).toLocaleString()}           sub="Người dùng hoạt động tháng"      icon={Activity} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
          <AdminKPICard label="Phiên trung bình" value={`${analytics?.avgSessionMinutes ?? 0}m`}         sub="Thời lượng phiên trung bình"      icon={Clock}    color="#f97316" bg="rgba(249,115,22,0.08)" />
          <AdminKPICard label="Tỷ lệ tính năng" value={`${analytics?.featureAdoptionRate ?? 0}%`}       sub="Tính năng phổ biến nhất"          icon={Zap}      color="#16a34a" bg="rgba(22,163,74,0.08)" />
          <AdminKPICard label="Sức khỏe Tenant" value={String(analytics?.tenantHealthScore ?? 0)}       sub="Trung bình toàn bộ tenant"        icon={BarChart3} color="#06b6d4" bg="rgba(6,182,212,0.08)" />
        </div>
      )}

      {/* DAU Chart + Device split */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
          <AdminCardHeader title="Người dùng hoạt động hằng ngày — 7 ngày gần đây" />
          {isLoading ? <SkeletonCard lines={4} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dauTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminDauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={35} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.75rem" }} />
                <Area name="NND hoạt động" type="monotone" dataKey="dau" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminDauGrad)" dot={{ fill: "#2563EB", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="Truy cập theo nền tảng" />
          {isLoading ? <SkeletonCard lines={4} /> : (
            <>
              <div className="flex flex-col gap-4">
                {(analytics?.accessBreakdown ?? []).map((item, idx) => {
                  const Icon = PLATFORM_ICONS[item.platform] ?? Globe;
                  const color = PLATFORM_COLORS[idx % PLATFORM_COLORS.length];
                  return (
                    <div key={item.platform} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color }} />
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>
                            {PLATFORM_LABELS[item.platform] ?? item.platform}
                          </span>
                        </div>
                        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827" }}>{item.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                        <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827", marginBottom: "10px" }}>Thời lượng phiên TB</h4>
                <ResponsiveContainer width="100%" height={90}>
                  <LineChart data={sessionTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v: number) => [`${v} phút`, "Phiên"]} contentStyle={{ borderRadius: "8px", fontSize: "0.72rem" }} />
                    <Line name="Phiên" type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* Feature usage + Tenant activity */}
      <div className="grid grid-cols-2 gap-5">
        <AdminCard>
          <AdminCardHeader title="Tỷ lệ sử dụng tính năng" />
          {isLoading ? <SkeletonCard lines={5} /> : (
            <div className="flex flex-col gap-3">
              {(analytics?.featureUsage ?? []).map(f => (
                <div key={f.feature} className="flex items-center gap-3">
                  <span className="w-32 flex-shrink-0" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{f.feature}</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${f.adoption}%`, background: f.adoption >= 70 ? "#2563EB" : f.adoption >= 40 ? "#7c3aed" : "#9ca3af" }}
                    />
                  </div>
                  <span className="w-10 text-right flex-shrink-0" style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{f.adoption}%</span>
                  <span className="w-16 text-right flex-shrink-0" style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{f.sessions.toLocaleString()} phiên</span>
                </div>
              ))}
              {(analytics?.featureUsage ?? []).length === 0 && (
                <p className="py-4 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có dữ liệu tính năng.</p>
              )}
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader
            title="Tenant hoạt động nhiều nhất"
            action={
              <button className="flex items-center gap-1" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>
                Xem tất cả <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          />
          {isLoading ? <SkeletonCard lines={5} /> : (
            <div className="flex flex-col gap-2.5">
              {(analytics?.topTenants ?? []).map((t, i) => (
                <div key={t.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#9ca3af", width: "16px" }}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                    <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{t.logins} đăng nhập · {t.bookings.toLocaleString()} lịch hẹn</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: t.health >= 90 ? "#16a34a" : "#f97316" }}>{t.health}</span>
                      <span style={{ fontSize: "0.58rem", color: "#9ca3af" }}>điểm</span>
                    </div>
                    <div className="h-1.5 w-16 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${t.health}%`, background: t.health >= 90 ? "#16a34a" : "#f97316" }} />
                    </div>
                  </div>
                </div>
              ))}
              {(analytics?.topTenants ?? []).length === 0 && (
                <p className="py-4 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có dữ liệu tenant.</p>
              )}
            </div>
          )}
        </AdminCard>
      </div>
    </>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Thống kê nền tảng" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Thống kê" }]}>
        <AnalyticsContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
