import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp, TrendingDown, Download, Calendar,
  DollarSign, PawPrint, Activity, RefreshCw,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import { useDashboardMetrics, useBookingHeatmap, useRevenueChart, useTopServices } from "@/hooks/clinic/useAnalyticsQueries";
import { useQueryClient } from "@tanstack/react-query";
import { clinicKeys } from "@/lib/queryKeys";
import "@/styles/fonts.css";

// ─── Period → days mapping ────────────────────────────────────────────────────
const PERIOD_DAYS: Record<string, number> = {
  "7D": 7,
  "4W": 28,
  "7M": 210,
  "1Y": 365,
};

// ─── Species colours (static — cosmetic only) ────────────────────────────────
const SPECIES_COLORS = ["var(--primary-theme-color, #2563EB)", "#7c3aed", "#16a34a", "#f97316", "#0891b2"];

// ─── Skeleton helpers ─────────────────────────────────────────────────────────
function SkeletonBox({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-100 ${className}`}
      style={style}
    />
  );
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
          <SkeletonBox className="w-9 h-9 rounded-xl" />
          <SkeletonBox className="h-3 w-24" />
          <SkeletonBox className="h-7 w-20" />
          <SkeletonBox className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton({ height = 260 }: { height?: number }) {
  return <SkeletonBox style={{ height }} className="w-full rounded-2xl" />;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 border border-white/10"
      style={{
        background: "#0f172a",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-1">
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{p.name}:</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: p.color }}>
            {typeof p.value === "number" ? p.value.toLocaleString("vi-VN") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("7M");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: clinicKeys.analytics() });
  }, [queryClient]);

  const days = PERIOD_DAYS[period] ?? 210;

  // API Queries using React Query hooks
  const { data: rawDashboard, isLoading: dashboardLoading, isError: dashboardError } = useDashboardMetrics();
  const { data: rawRevenue, isLoading: revenueLoading, isError: revenueError } = useRevenueChart(days);
  const { data: rawTopServices, isLoading: servicesLoading, isError: servicesError } = useTopServices(5);
  const { data: rawHeatmap, isLoading: heatmapLoading, isError: heatmapError } = useBookingHeatmap(days);

  const dashboard = rawDashboard;

  const revenueChart = useMemo(() => {
    return Array.isArray(rawRevenue) ? rawRevenue : rawRevenue?.items || [];
  }, [rawRevenue]);

  const topServices = useMemo(() => {
    return Array.isArray(rawTopServices) ? rawTopServices : rawTopServices?.items || [];
  }, [rawTopServices]);

  const heatmap = useMemo(() => {
    return Array.isArray(rawHeatmap) ? rawHeatmap : rawHeatmap?.items || [];
  }, [rawHeatmap]);

  const isLoading = dashboardLoading || revenueLoading || servicesLoading || heatmapLoading;
  const isError = dashboardError || revenueError || servicesError || heatmapError;

  // ── Export handler ─────────────────────────────────────────────────────────
  function handleExport() {
    if (exporting || isLoading) return;
    setExporting(true);

    // Build simple CSV from top services
    const rows = [
      ["Dịch vụ", "Số ca", "Doanh thu (VND)", "Tăng trưởng (%)"],
      ...topServices.map((s: any) => [s.name ?? s.serviceName, s.count ?? s.totalCount, s.revenue ?? s.totalRevenue, s.growth ?? s.growthRate ?? ""]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bao-cao-pettech-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExporting(false);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  // ── Derived KPI values from ShopDashboardDto ───────────────────────────────
  const fmt = (n: number | undefined | null, prefix = "", suffix = "") =>
    n == null ? "—" : `${prefix}${n.toLocaleString("vi-VN")}${suffix}`;

  const kpiCards = [
    {
      label: "Doanh thu tháng",
      value: fmt(dashboard?.totalRevenue ?? dashboard?.revenueThisMonth, "", " ₫"),
      trend: dashboard?.revenueGrowth != null ? `${dashboard.revenueGrowth > 0 ? "+" : ""}${dashboard.revenueGrowth.toFixed(1)}%` : undefined,
      trendPos: (dashboard?.revenueGrowth ?? 0) >= 0,
      icon: DollarSign,
      color: "var(--primary-theme-color, #2563EB)",
      description: dashboard?.revenueDescription ?? "",
    },
    {
      label: "Tổng lịch hẹn",
      value: fmt(dashboard?.totalBookings ?? dashboard?.appointmentsThisMonth),
      trend: dashboard?.bookingGrowth != null ? `${dashboard.bookingGrowth > 0 ? "+" : ""}${dashboard.bookingGrowth.toFixed(1)}%` : undefined,
      trendPos: (dashboard?.bookingGrowth ?? 0) >= 0,
      icon: Calendar,
      color: "#16a34a",
      description: dashboard?.bookingDescription ?? "",
    },
    {
      label: "Bệnh nhân mới",
      value: fmt(dashboard?.newPatients ?? dashboard?.newCustomers),
      trend: dashboard?.patientGrowth != null ? `${dashboard.patientGrowth > 0 ? "+" : ""}${dashboard.patientGrowth.toFixed(1)}%` : undefined,
      trendPos: (dashboard?.patientGrowth ?? 0) >= 0,
      icon: PawPrint,
      color: "#7c3aed",
      description: dashboard?.patientDescription ?? "",
    },
    {
      label: "Tỷ lệ lấp đầy",
      value: dashboard?.occupancyRate != null ? `${dashboard.occupancyRate}%` : "—",
      trend: dashboard?.occupancyGrowth != null ? `${dashboard.occupancyGrowth > 0 ? "+" : ""}${dashboard.occupancyGrowth.toFixed(1)}%` : undefined,
      trendPos: (dashboard?.occupancyGrowth ?? 0) >= 0,
      icon: Activity,
      color: "#f97316",
      description: dashboard?.occupancyDescription ?? "",
    },
  ];

  // ── Revenue chart data normalisation ──────────────────────────────────────
  const chartData = revenueChart.map((d: any) => ({
    month: d.label ?? d.month ?? d.date ?? d.day,
    revenue: d.revenue ?? d.totalRevenue ?? d.amount ?? 0,
    target: d.target ?? d.revenueTarget ?? 0,
  }));

  // ── Heatmap normalisation ─────────────────────────────────────────────────
  const heatmapData = heatmap.map((d: any) => ({
    day: d.day ?? d.label ?? d.dayOfWeek ?? d.date,
    appts: d.count ?? d.bookingCount ?? d.totalBookings ?? 0,
  }));

  // ── Top services normalisation ─────────────────────────────────────────────
  const servicesData = topServices.map((s: any) => ({
    name: s.name ?? s.serviceName ?? "—",
    count: s.count ?? s.totalCount ?? s.bookingCount ?? 0,
    revenue: s.revenue ?? s.totalRevenue ?? 0,
    growth: s.growth ?? s.growthRate ?? 0,
  }));

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <ClinicPageShell
        title="Báo cáo & Phân tích"
        breadcrumbs={[{ label: "Dashboard", href: "/clinic" }, { label: "Báo cáo" }]}
      >
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>
            Không thể tải dữ liệu báo cáo
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#9ca3af", maxWidth: 360 }}>
            Đã xảy ra lỗi khi kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.
          </p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
            style={{ background: "var(--primary-theme-color, #2563EB)", color: "white", fontWeight: 700, fontSize: "0.85rem" }}
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      </ClinicPageShell>
    );
  }

  const HeaderActions = (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Period selector */}
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
        {["7D", "4W", "7M", "1Y"].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
            style={{
              fontSize: "0.75rem", fontWeight: 700,
              background: period === p ? "var(--primary-theme-color, #2563EB)" : "transparent",
              color: period === p ? "white" : "#64748b",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Refresh */}
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
        style={{ background: "white", border: "1.5px solid #e2e8f0", fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-500" : "text-gray-500"}`} />
        Làm mới
      </button>

      {/* Export */}
      <button
        onClick={handleExport}
        disabled={isLoading || exporting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px active:scale-95 disabled:opacity-50 shadow-sm"
        style={{
          background: exported ? "#16a34a" : "#fff",
          border: "1.5px solid " + (exported ? "#16a34a" : "#e2e8f0"),
          fontSize: "0.82rem", fontWeight: 700,
          color: exported ? "#fff" : "#1e293b",
          boxShadow: exported ? "0 4px 12px rgba(22,163,74,0.2)" : "none",
        }}
      >
        {exporting
          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang xuất…</>
          : exported
            ? <><CheckCircle2 className="w-4 h-4" /> Đã xuất CSV</>
            : <><Download className="w-4 h-4" /> Xuất báo cáo</>
        }
      </button>
    </div>
  );

  return (
    <ClinicPageShell
      title="Báo cáo & Phân tích"
      breadcrumbs={[{ label: "Dashboard", href: "/clinic" }, { label: "Báo cáo" }]}
      headerActions={HeaderActions}
    >
      <div className="flex flex-col gap-6">

        {/* ── KPI Cards ── */}
        {isLoading ? <KPISkeleton /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpiCards.map(c => (
              <ClinicStatCard
                key={c.label}
                label={c.label}
                value={c.value}
                trend={c.trend}
                trendPos={c.trendPos}
                icon={c.icon}
                color={c.color}
                description={c.description}
              />
            ))}
          </div>
        )}

        {/* ── Charts Row 1: Revenue + Species ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue area chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 font-bold text-base">Xu hướng doanh thu</h3>
                <p className="text-gray-500 text-xs mt-1">Kỳ: {period}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[11px] font-bold text-gray-500">Doanh thu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="text-[11px] font-bold text-gray-500">Mục tiêu</span>
                </div>
              </div>
            </div>
            {isLoading ? <ChartSkeleton height={260} /> : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chưa có dữ liệu doanh thu</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-theme-color, #2563EB)" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="var(--primary-theme-color, #2563EB)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false}
                    tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Mục tiêu" />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary-theme-color, #2563EB)" strokeWidth={3} fill="url(#revGrad)" name="Doanh thu" animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Species pie chart — kept static as cosmetic / no backend endpoint */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-gray-900 font-bold text-base">Cơ cấu bệnh nhân</h3>
            <p className="text-gray-500 text-xs mt-1 mb-4">Phân loại theo loài</p>
            {isLoading ? <ChartSkeleton height={220} /> : (() => {
              // Try to build species data from dashboard if available
              const speciesRaw: any[] = dashboard?.speciesBreakdown ?? dashboard?.patientSpecies ?? [];
              const speciesData = speciesRaw.length > 0
                ? speciesRaw.map((s: any, i: number) => ({
                    name: s.species ?? s.label ?? s.name ?? `Loài ${i + 1}`,
                    value: s.percentage ?? s.count ?? s.value ?? 0,
                    color: SPECIES_COLORS[i % SPECIES_COLORS.length],
                  }))
                : [{ name: "Chưa có dữ liệu", value: 1, color: "#e5e7eb" }];
              return (
                <div className="flex-1 flex flex-col justify-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={speciesData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" animationDuration={1000}>
                        {speciesData.map((_, i) => (
                          <Cell key={i} fill={speciesData[i].color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2.5 mt-4">
                    {speciesData.map(s => (
                      <div key={s.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                          <span className="text-xs font-bold text-gray-700">{s.name}</span>
                        </div>
                        <span className="text-xs font-black text-gray-900">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── Charts Row 2: Heatmap + Top Services ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Booking heatmap bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold text-base">Tần suất lịch hẹn</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">Thống kê theo kỳ: {period}</p>
            {isLoading ? <ChartSkeleton height={200} /> : heatmapData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={heatmapData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
                  <Bar dataKey="appts" fill="var(--primary-theme-color, #2563EB)" radius={[6, 6, 0, 0]} name="Lịch hẹn" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top services */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold text-base">Top dịch vụ doanh thu</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">Kỳ: {period}</p>
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <SkeletonBox className="w-4 h-3" />
                    <SkeletonBox className="h-3 flex-1" />
                    <SkeletonBox className="w-14 h-3" />
                    <SkeletonBox className="w-10 h-5 rounded-full" />
                  </div>
                ))}
              </div>
            ) : servicesData.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Chưa có dữ liệu dịch vụ</div>
            ) : (() => {
              const maxRev = Math.max(...servicesData.map((s: any) => s.revenue));
              return (
                <div className="flex flex-col gap-4">
                  {servicesData.map((s: any, i: number) => (
                    <div key={s.name} className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-gray-300 w-4 flex-shrink-0">0{i + 1}</span>
                      <div className="flex-1 flex items-center gap-4 min-w-0">
                        <span className="text-xs font-bold text-gray-700 min-w-[120px] truncate">{s.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-gray-50 overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all duration-700"
                            style={{ width: maxRev > 0 ? `${(s.revenue / maxRev) * 100}%` : "0%" }} />
                        </div>
                        <span className="text-xs font-black text-gray-900 min-w-[60px] text-right flex-shrink-0">
                          {(s.revenue / 1_000_000).toFixed(1)}M
                        </span>
                        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black min-w-[44px] flex-shrink-0 ${s.growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                          {s.growth >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          {Math.abs(s.growth)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="h-4" />
      </div>
    </ClinicPageShell>
  );
}
