import {
  Activity, Users, BarChart3, Clock, Zap, TrendingUp,
  Globe, Smartphone, Monitor, ArrowUpRight,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader } from "@/components/admin/AdminWidgets";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import "@/styles/fonts.css";

const DAU_DATA = [
  { day: "28/2", dau: 312 }, { day: "1/3", dau: 334 }, { day: "2/3", dau: 298 },
  { day: "3/3", dau: 345 }, { day: "4/3", dau: 361 }, { day: "5/3", dau: 378 },
  { day: "6/3", dau: 389 },
];

const FEATURE_USAGE = [
  { feature: "Lịch hẹn",       sessions: 4820, pct: 94 },
  { feature: "Hồ sơ y tế",     sessions: 3910, pct: 76 },
  { feature: "Smart POS",       sessions: 3540, pct: 69 },
  { feature: "Kho hàng",        sessions: 2780, pct: 54 },
  { feature: "Bảng công việc",  sessions: 2120, pct: 41 },
  { feature: "CRM / Khách hàng",sessions: 1870, pct: 36 },
  { feature: "Báo cáo",         sessions: 1240, pct: 24 },
];

const SESSION_DATA = [
  { month: "Th10", avg: 18 }, { month: "Th11", avg: 21 }, { month: "Th12", avg: 19 },
  { month: "Th1",  avg: 24 }, { month: "Th2",  avg: 26 }, { month: "Th3",  avg: 29 },
];

const TENANT_ACTIVITY = [
  { name: "Clearview Vet Group",    logins: 31, bookings: 5610, plan: "Enterprise", health: 98 },
  { name: "PetCare Express",        logins: 28, bookings: 3870, plan: "Enterprise", health: 95 },
  { name: "Furever Vet Clinic",     logins: 26, bookings: 4320, plan: "Enterprise", health: 97 },
  { name: "Urban Animal Clinic",    logins: 22, bookings: 2100, plan: "Growth",     health: 91 },
  { name: "Paws & Claws Clinic",    logins: 19, bookings: 1240, plan: "Growth",     health: 82 },
  { name: "PetHealth Partners",     logins: 17, bookings: 1780, plan: "Growth",     health: 88 },
];

export default function AdminAnalyticsPage() {
  return (
    <AdminPageShell title="Thống kê nền tảng" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Thống kê" }]}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Thống kê nền tảng</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Dữ liệu sử dụng từ 142 tenant đang hoạt động · Cập nhật mỗi 15 phút</p>
        </div>
        <div className="flex items-center gap-2">
          {["7N", "30N", "90N"].map((r, i) => (
            <button key={r} className="px-3.5 py-1.5 rounded-xl" style={{ background: i === 0 ? "#2563EB" : "white", color: i === 0 ? "white" : "#6b7280", fontSize: "0.75rem", fontWeight: 700, border: i === 0 ? "none" : "1.5px solid rgba(0,0,0,0.08)" }}>{r}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <AdminKPICard label="DAU" value="389" sub="Người dùng hoạt động hôm nay" icon={Users} color="#2563EB" bg="rgba(37,99,235,0.08)" trend="+3,2%" trendUp />
        <AdminKPICard label="MAU" value="5.812" sub="Người dùng hoạt động tháng" icon={Activity} color="#7c3aed" bg="rgba(124,58,237,0.08)" trend="+8,4%" trendUp />
        <AdminKPICard label="Phiên trung bình" value="29m" sub="Tăng từ 26 phút tháng trước" icon={Clock} color="#f97316" bg="rgba(249,115,22,0.08)" trend="+11,5%" trendUp />
        <AdminKPICard label="Tỷ lệ tính năng" value="94%" sub="Tính năng Lịch hẹn" icon={Zap} color="#16a34a" bg="rgba(22,163,74,0.08)" trend="+2%" trendUp />
        <AdminKPICard label="Sức khỏe Tenant" value="91" sub="Trung bình toàn bộ tenant" icon={BarChart3} color="#06b6d4" bg="rgba(6,182,212,0.08)" trend="+3đ" trendUp />
      </div>

      {/* DAU Chart + Device split */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
          <AdminCardHeader 
            title="Người dùng hoạt động hằng ngày — 7 ngày gần đây" 
            action={
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(37,99,235,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#2563EB" }}>
                <TrendingUp className="w-3 h-3" /> +24,7% so tuần trước
              </span>
            }
          />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={DAU_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="adminDauGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={35} />
              <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.75rem" }} />
              <Area key="area-dau" name="NND hoạt động" type="monotone" dataKey="dau" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminDauGrad)" dot={{ fill: "#2563EB", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="Truy cập theo nền tảng" />
          <div className="flex flex-col gap-4">
            {[
              { icon: Monitor,    label: "Máy tính",       pct: 58, color: "#2563EB" },
              { icon: Smartphone, label: "Mobile PWA",     pct: 31, color: "#7c3aed" },
              { icon: Globe,      label: "Máy tính bảng",  pct: 11, color: "#f97316" },
            ].map(p => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: p.color }} />
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{p.label}</span>
                    </div>
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827" }}>{p.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                    <div className="h-2 rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <h4 style={{ fontSize: "0.78rem", fontWeight: 800, color: "#111827", marginBottom: "10px" }}>Thời lượng phiên TB</h4>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={SESSION_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => [`${v} phút`, "Phiên"]} contentStyle={{ borderRadius: "8px", fontSize: "0.72rem" }} />
                <Line key="line-session" name="Phiên" type="monotone" dataKey="avg" stroke="#7c3aed" strokeWidth={2} dot={{ fill: "#7c3aed", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Feature usage + Tenant activity */}
      <div className="grid grid-cols-2 gap-5">
        <AdminCard>
          <AdminCardHeader title="Tỷ lệ sử dụng tính năng" />
          <div className="flex flex-col gap-3">
            {FEATURE_USAGE.map(f => (
              <div key={f.feature} className="flex items-center gap-3">
                <span className="w-32 flex-shrink-0" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{f.feature}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${f.pct}%`, background: f.pct >= 70 ? "#2563EB" : f.pct >= 40 ? "#7c3aed" : "#9ca3af" }} />
                </div>
                <span className="w-10 text-right flex-shrink-0" style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{f.pct}%</span>
                <span className="w-16 text-right flex-shrink-0" style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{f.sessions.toLocaleString()} phiên</span>
              </div>
            ))}
          </div>
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
          <div className="flex flex-col gap-2.5">
            {TENANT_ACTIVITY.map((t, i) => (
              <div key={t.name} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 900, color: "#9ca3af", width: "16px" }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{t.name}</p>
                  <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{t.plan} · {t.bookings.toLocaleString()} lịch hẹn</p>
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
          </div>
        </AdminCard>
      </div>
    </AdminPageShell>
  );
}
