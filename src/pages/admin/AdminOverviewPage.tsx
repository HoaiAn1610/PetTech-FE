import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users, CreditCard, TrendingUp, TrendingDown, Activity,
  AlertCircle, CheckCircle2, Clock, ArrowUpRight, Zap,
  ShieldCheck, Server, Wifi, Database, Globe, BarChart3,
  PawPrint, ChevronRight, Circle,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader } from "@/components/admin/AdminWidgets";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import "@/styles/fonts.css";

const MRR_DATA = [
  { month: "Th9", mrr: 18400 }, { month: "Th10", mrr: 21200 }, { month: "Th11", mrr: 23800 },
  { month: "Th12", mrr: 26100 }, { month: "Th1", mrr: 28900 }, { month: "Th2", mrr: 31400 },
  { month: "Th3", mrr: 34750 },
];

const CHURN_DATA = [
  { month: "Th9", churn: 3 }, { month: "Th10", churn: 2 }, { month: "Th11", churn: 4 },
  { month: "Th12", churn: 1 }, { month: "Th1", churn: 3 }, { month: "Th2", churn: 2 },
  { month: "Th3", churn: 1 },
];

const RECENT_SIGNUPS = [
  { name: "Happy Tails Animal Hospital", plan: "Starter",    date: "6/3/2026",  status: "Dùng thử",  avatar: "HT", color: "#2563EB" },
  { name: "Furever Vet Clinic",          plan: "Growth",     date: "5/3/2026",  status: "Hoạt động", avatar: "FV", color: "#16a34a" },
  { name: "PetCare Express",             plan: "Enterprise", date: "3/3/2026",  status: "Hoạt động", avatar: "PE", color: "#7c3aed" },
  { name: "Gentle Paws Veterinary",      plan: "Starter",    date: "1/3/2026",  status: "Hoạt động", avatar: "GP", color: "#f97316" },
  { name: "Urban Animal Clinic",         plan: "Growth",     date: "28/2/2026", status: "Hoạt động", avatar: "UA", color: "#06b6d4" },
];

const ACTIVITY_FEED = [
  { icon: Users,       color: "#2563EB", msg: "Tenant mới đăng ký: Happy Tails Animal Hospital",          time: "3 phút trước" },
  { icon: CreditCard,  color: "#dc2626", msg: "Thanh toán thất bại: Paws & Claws Clinic — $149.00",        time: "14 phút trước" },
  { icon: TrendingUp,  color: "#16a34a", msg: "Furever Care nâng cấp lên gói Enterprise (+$350 MRR)",      time: "1 giờ trước" },
  { icon: AlertCircle, color: "#f97316", msg: "Phiếu hỗ trợ #1042 được mở — Sự cố kết nối API",           time: "2 giờ trước" },
  { icon: CheckCircle2,color: "#16a34a", msg: "Sao lưu định kỳ hoàn thành thành công (bao phủ 99.98%)",   time: "3 giờ trước" },
  { icon: ShieldCheck, color: "#7c3aed", msg: "Admin Sarah Chen được thêm — vai trò Nhân viên hỗ trợ",    time: "Hôm qua" },
];

const STATUS_SERVICES = [
  { name: "API Gateway",    status: "operational", uptime: "99.99%" },
  { name: "Database (RDS)", status: "operational", uptime: "99.97%" },
  { name: "Auth Service",   status: "operational", uptime: "100%"   },
  { name: "Email (SES)",    status: "degraded",    uptime: "97.4%"  },
  { name: "Storage (S3)",   status: "operational", uptime: "99.99%" },
  { name: "WebSocket",      status: "operational", uptime: "99.91%" },
];


export default function AdminOverviewPage() {
  const navigate = useNavigate();

  return (
    <AdminPageShell title="Tổng quan" breadcrumbs={[{ label: "Cổng quản trị" }, { label: "Tổng quan" }]}>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Tổng quan nền tảng</h2>
                <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Thứ Sáu, 6 tháng 3, 2026 · Tất cả hệ thống bình thường</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>Tất cả hệ thống hoạt động</span>
                </div>
                <button onClick={() => navigate("/admin/tenants")} className="flex items-center gap-2 px-4 py-2 rounded-xl hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
                  <Users className="w-3.5 h-3.5" /> Quản lý Tenant
                </button>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-6 gap-4">
              <AdminKPICard label="Doanh thu định kỳ tháng" value="$34.750" sub="+10,6% so tháng trước"    icon={CreditCard}   color="#2563EB" bg="rgba(37,99,235,0.08)"  trend="+10,6%" trendUp />
              <AdminKPICard label="Tổng Tenant đang hoạt động" value="142"  sub="12 dùng thử · 130 đã trả"  icon={Users}        color="#16a34a" bg="rgba(22,163,74,0.08)"  trend="+7 tháng này" trendUp />
              <AdminKPICard label="Doanh thu định kỳ năm"     value="$417K" sub="Dự kiến ARR năm 2026"      icon={TrendingUp}   color="#7c3aed" bg="rgba(124,58,237,0.08)" trend="+26% YoY" trendUp />
              <AdminKPICard label="Doanh thu TB mỗi Tenant"   value="$244"  sub="ARPU · tăng từ $231"       icon={BarChart3}    color="#f97316" bg="rgba(249,115,22,0.08)"  trend="+5,6%" trendUp />
              <AdminKPICard label="Tỷ lệ rời bỏ tháng"       value="0,7%"  sub="1 hủy bỏ tháng này"        icon={TrendingDown} color="#dc2626" bg="rgba(220,38,38,0.07)"   trend="-0,3%" trendUp />
              <AdminKPICard label="Phiếu hỗ trợ đang mở"     value="8"     sub="2 ưu tiên cao"              icon={AlertCircle}  color="#ea580c" bg="rgba(249,115,22,0.07)"  trend="-5 đã xử lý" trendUp />
            </div>

            {/* MRR Chart + Activity */}
            <div className="grid grid-cols-3 gap-5">
              {/* MRR Chart */}
              <AdminCard className="col-span-2">
                <AdminCardHeader
                  title="Tăng trưởng MRR"
                  subtitle="Doanh thu định kỳ hàng tháng · 7 tháng gần đây"
                  action={
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "rgba(22,163,74,0.08)", fontSize: "0.68rem", fontWeight: 700, color: "#16a34a" }}>
                      <TrendingUp className="w-3 h-3" /> +88,9% trong 6 tháng
                    </span>
                  }
                />
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={MRR_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="adminMrrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
                    <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]} contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.78rem" }} />
                    <Area key="area-mrr" name="MRR" type="monotone" dataKey="mrr" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminMrrGrad)" dot={{ fill: "#2563EB", r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </AdminCard>

              <AdminCard>
                <AdminCardHeader title="Hoạt động gần đây" />
                <div className="flex flex-col gap-3">
                  {ACTIVITY_FEED.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${item.color}12` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: "0.72rem", color: "#374151", lineHeight: 1.4 }}>{item.msg}</p>
                          <p style={{ fontSize: "0.6rem", color: "#9ca3af", marginTop: "2px" }}>{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AdminCard>
            </div>

            {/* Recent Signups + System Health */}
            <div className="grid grid-cols-3 gap-5">
              <AdminCard className="col-span-2">
                <AdminCardHeader title="Tenant đăng ký gần đây" action={
                  <button onClick={() => navigate("/admin/tenants")} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors" style={{ fontSize: "0.72rem", fontWeight: 700 }}>
                    Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                } />
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      {["Phòng khám", "Gói", "Trạng thái", "Ngày đăng ký", ""].map(h => (
                        <th key={h} className="pb-2.5 text-left" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_SIGNUPS.map((t, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate("/admin/tenants")} style={{ borderBottom: i < RECENT_SIGNUPS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}15` }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: t.color }}>{t.avatar}</span>
                            </div>
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{t.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded-lg" style={{ background: t.plan === "Enterprise" ? "rgba(124,58,237,0.08)" : t.plan === "Growth" ? "rgba(37,99,235,0.08)" : "rgba(0,0,0,0.05)", fontSize: "0.68rem", fontWeight: 700, color: t.plan === "Enterprise" ? "#7c3aed" : t.plan === "Growth" ? "#2563EB" : "#6b7280" }}>
                            {t.plan}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.status === "Hoạt động" ? "#16a34a" : "#f97316" }} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: t.status === "Hoạt động" ? "#16a34a" : "#ea580c" }}>{t.status}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{t.date}</span>
                        </td>
                        <td className="py-3">
                          <ChevronRight className="w-4 h-4" style={{ color: "#d1d5db" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminCard>

              <AdminCard>
                <AdminCardHeader title="Tình trạng hệ thống" action={
                  <button onClick={() => navigate("/admin/system")} style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>Chi tiết →</button>
                } />
                <div className="flex flex-col gap-2.5">
                  {STATUS_SERVICES.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl" style={{ background: s.status === "operational" ? "rgba(22,163,74,0.04)" : "rgba(249,115,22,0.06)", border: `1px solid ${s.status === "operational" ? "rgba(22,163,74,0.12)" : "rgba(249,115,22,0.2)"}` }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: s.status === "operational" ? "#16a34a" : "#f97316" }} />
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: s.status === "operational" ? "#16a34a" : "#f97316" }}>{s.uptime}</span>
                        {s.status === "degraded" && <AlertCircle className="w-3.5 h-3.5" style={{ color: "#f97316" }} />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 px-3.5 py-3 rounded-xl" style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.18)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ea580c" }}>⚠ Dịch vụ Email đang bị gián đoạn</p>
                  <p style={{ fontSize: "0.62rem", color: "#9ca3af", marginTop: "2px" }}>Đang phối hợp với đội AWS SES · Dự kiến giải quyết sau 2 giờ</p>
                </div>
              </AdminCard>
            </div>

            {/* Plan Distribution */}
            <AdminCard>
              <AdminCardHeader title="Phân phối gói Tenant" />
              <div className="grid grid-cols-4 gap-5">
                {[
                  { plan: "Starter",    count: 54, pct: 38, color: "#6b7280", mrr: "$2.700",  desc: "$50/tháng" },
                  { plan: "Growth",     count: 67, pct: 47, color: "#2563EB", mrr: "$20.100", desc: "$300/tháng" },
                  { plan: "Enterprise", count: 21, pct: 15, color: "#7c3aed", mrr: "$12.600", desc: "$600/tháng" },
                  { plan: "Trial",      count: 12, pct: 8,  color: "#f97316", mrr: "$0",      desc: "Miễn phí 14 ngày" },
                ].map((p) => (
                  <div key={p.plan} className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#111827" }}>{p.plan}</p>
                        <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{p.desc}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontSize: "1.1rem", fontWeight: 900, color: p.color, letterSpacing: "-0.03em" }}>{p.count}</p>
                        <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>tenant</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{p.pct}% tổng số</span>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>{p.mrr} MRR</span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

          </AdminPageShell>
  );
}


