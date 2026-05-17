import { useState } from "react";
import {
  TrendingUp, TrendingDown, Download, Calendar,
  DollarSign, PawPrint, Activity, RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { ClinicPageShell } from "@/components/clinic/ClinicPageShell";
import { ClinicStatCard } from "@/components/clinic/ClinicStatCard";
import "@/styles/fonts.css";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const REVENUE_DATA = [
  { month: "Th9", revenue: 18200, target: 18000 },
  { month: "Th10", revenue: 21400, target: 20000 },
  { month: "Th11", revenue: 19800, target: 21000 },
  { month: "Th12", revenue: 24600, target: 22000 },
  { month: "Th1", revenue: 22100, target: 23000 },
  { month: "Th2", revenue: 26800, target: 24000 },
  { month: "Th3", revenue: 28400, target: 25000 },
];

const SPECIES_DATA = [
  { name: "Chó", value: 58, color: "#2563EB" },
  { name: "Mèo", value: 31, color: "#7c3aed" },
  { name: "Chim", value: 6, color: "#16a34a" },
  { name: "Khác", value: 5, color: "#f97316" },
];

const TOP_SERVICES = [
  { name: "Khám sức khoẻ định kỳ", count: 312, revenue: 26520, growth: 12 },
  { name: "Tiêm vaccine", count: 248, revenue: 10416, growth: 8 },
  { name: "Tắm chải toàn bộ", count: 186, revenue: 13950, growth: 21 },
  { name: "Vệ sinh răng miệng", count: 94, revenue: 16920, growth: -3 },
  { name: "Xét nghiệm", count: 87, revenue: 6525, growth: 34 },
];

const DAILY_DATA = [
  { day: "T2", appts: 38, revenue: 3840 },
  { day: "T3", appts: 52, revenue: 4960 },
  { day: "T4", appts: 47, revenue: 4200 },
  { day: "T5", appts: 61, revenue: 5490 },
  { day: "T6", appts: 55, revenue: 4950 },
  { day: "T7", appts: 43, revenue: 3680 },
  { day: "CN", appts: 18, revenue: 1440 },
];

const VET_PERFORMANCE = [
  { name: "BS. Lee", appointments: 312, revenue: 42100, satisfaction: 4.9, utilization: 91 },
  { name: "BS. Chen", appointments: 278, revenue: 37800, satisfaction: 4.7, utilization: 85 },
  { name: "BS. Patel", appointments: 234, revenue: 31200, satisfaction: 4.8, utilization: 79 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 border border-white/10" style={{ background: "#0f172a", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)", fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 mt-1">
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{p.name}:</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 800, color: p.color }}>
              {p.name.toLowerCase().includes("revenue") || p.name.toLowerCase().includes("mục tiêu") ? "$" : ""}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("7M");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  function handleExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 3000); }, 1500);
  }

  return (
    <ClinicPageShell
      title="Báo cáo & Phân tích"
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Báo cáo" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.025em" }}>Bảng phân tích hiệu suất</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Dữ liệu tổng hợp từ phòng khám · Cập nhật: 10 phút trước</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              {["7D", "4W", "7M", "1Y"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3.5 py-1.5 rounded-lg transition-all"
                  style={{ fontSize: "0.75rem", fontWeight: 700, background: period === p ? "#2563EB" : "transparent", color: period === p ? "white" : "#64748b" }}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 shadow-sm"
              style={{
                background: exported ? "#16a34a" : "#fff",
                border: "1.5px solid " + (exported ? "#16a34a" : "#e2e8f0"),
                fontSize: "0.82rem", fontWeight: 700,
                color: exported ? "#fff" : "#1e293b",
                boxShadow: exported ? "0 4px 12px rgba(22,163,74,0.2)" : "none"
              }}>
              {exporting
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang xử lý…</>
                : exported
                  ? <><CheckCircle2 className="w-4 h-4" /> Đã xuất dữ liệu</>
                  : <><Download className="w-4 h-4" /> Xuất báo cáo</>
              }
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-4 gap-4">
          <ClinicStatCard label="Doanh thu tháng" value="$28,400" trend="+6.0%" trendPos icon={DollarSign} color="#2563EB" description="so với $26,800 tháng trước" />
          <ClinicStatCard label="Tổng lịch hẹn" value="228" trend="+8.1%" trendPos icon={Calendar} color="#16a34a" description="so với 211 tháng trước" />
          <ClinicStatCard label="Bệnh nhân mới" value="1,840" trend="+4.2%" trendPos icon={PawPrint} color="#7c3aed" description="23 ca mới tháng này" />
          <ClinicStatCard label="DT trung bình/ca" value="$124.6" trend="-1.8%" trendPos={false} icon={Activity} color="#f97316" description="so với $126.9 tháng trước" />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 font-bold text-base">Xu hướng doanh thu</h3>
                <p className="text-gray-500 text-xs mt-1">7 tháng gần nhất</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-600" /><span className="text-[11px] font-bold text-gray-500">Doanh thu</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-gray-200" /><span className="text-[11px] font-bold text-gray-500">Mục tiêu</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} fill="none" strokeDasharray="5 5" name="Mục tiêu" />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} fill="url(#revGrad)" name="Doanh thu" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-gray-900 font-bold text-base">Cấu trúc bệnh nhân</h3>
            <p className="text-gray-500 text-xs mt-1 mb-4">Phân loại theo loài</p>
            <div className="flex-1 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={SPECIES_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" animationDuration={1000}>
                    {SPECIES_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5 mt-4">
                {SPECIES_DATA.map(s => (
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
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold text-base">Tần suất lịch hẹn</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">Thống kê theo ngày trong tuần</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DAILY_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="appts" fill="#2563EB" radius={[6, 6, 0, 0]} name="Lịch hẹn" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-gray-900 font-bold text-base">Top dịch vụ doanh thu</h3>
            <p className="text-gray-500 text-xs mt-1 mb-6">Tháng 3/2026</p>
            <div className="flex flex-col gap-4">
              {TOP_SERVICES.map((s, i) => {
                const maxRev = Math.max(...TOP_SERVICES.map(x => x.revenue));
                return (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-300 w-4">0{i + 1}</span>
                    <div className="flex-1 flex items-center gap-4">
                      <span className="text-xs font-bold text-gray-700 min-w-[130px]">{s.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-50 overflow-hidden">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${(s.revenue / maxRev) * 100}%` }} />
                      </div>
                      <span className="text-xs font-black text-gray-900 min-w-[50px] text-right">${(s.revenue / 1000).toFixed(1)}k</span>
                      <span className={"flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black min-w-[40px] " + (s.growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600")}>
                        {s.growth >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                        {Math.abs(s.growth)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vet Performance Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-gray-900 font-bold text-base">Năng suất đội ngũ bác sĩ</h3>
            <p className="text-gray-500 text-xs mt-0.5">Xếp hạng dựa trên doanh thu và hài lòng</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-white border-b border-gray-50">
                {["Bác sĩ", "Số ca khám", "Doanh thu", "Hài lòng", "Hiệu suất", ""].map(h => (
                  <th key={h} className="px-6 py-3.5 text-left text-[10px] font-black text-gray-400 uppercase letter-spacing-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {VET_PERFORMANCE.map((v, i) => (
                <tr key={v.name} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={"w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm " + (i === 0 ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600")}>
                        {v.name.split(" ")[1][0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{v.name}</p>
                        {i === 0 && <span className="text-[10px] font-black text-orange-600">Top Performance</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-600">{v.appointments}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">${v.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-sm font-black text-gray-900">{v.satisfaction}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 rounded-full bg-gray-50 overflow-hidden">
                        <div className={"h-full rounded-full " + (v.utilization >= 85 ? "bg-green-500" : "bg-orange-500")} style={{ width: `${v.utilization}%` }} />
                      </div>
                      <span className={"text-xs font-black " + (v.utilization >= 85 ? "text-green-600" : "text-orange-600")}>{v.utilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 text-xs font-bold hover:underline">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-4" />
      </div>
    </ClinicPageShell>
  );
}

