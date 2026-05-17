import { useState } from "react";
import {
  CreditCard, TrendingUp, TrendingDown, DollarSign,
  Download, Eye, AlertTriangle, CheckCircle2, Clock,
  RefreshCw, Lock, Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader } from "@/components/admin/AdminWidgets";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "@/styles/fonts.css";

const MRR_TREND = [
  { month: "Th10", mrr: 21200, new: 4800, churn: 600 },
  { month: "Th11", mrr: 23800, new: 3900, churn: 800 },
  { month: "Th12", mrr: 26100, new: 3600, churn: 700 },
  { month: "Th1",  mrr: 28900, new: 4100, churn: 500 },
  { month: "Th2",  mrr: 31400, new: 3800, churn: 600 },
  { month: "Th3",  mrr: 34750, new: 4200, churn: 350 },
];

const INVOICES = [
  { id: "INV-2026-091", tenant: "Paws & Claws Clinic",    plan: "Growth",     amount: 149,  status: "Thất bại",         date: "1/3/2026",  color: "#dc2626" },
  { id: "INV-2026-090", tenant: "Clearview Vet Group",    plan: "Enterprise", amount: 599,  status: "Đã thanh toán",    date: "1/3/2026",  color: "#16a34a" },
  { id: "INV-2026-089", tenant: "Furever Vet Clinic",     plan: "Enterprise", amount: 599,  status: "Đã thanh toán",    date: "1/3/2026",  color: "#16a34a" },
  { id: "INV-2026-088", tenant: "Urban Animal Clinic",    plan: "Growth",     amount: 299,  status: "Đã thanh toán",    date: "1/3/2026",  color: "#16a34a" },
  { id: "INV-2026-087", tenant: "PetHealth Partners",     plan: "Growth",     amount: 299,  status: "Đã thanh toán",    date: "1/3/2026",  color: "#16a34a" },
  { id: "INV-2026-086", tenant: "All Creatures Vet",      plan: "Starter",    amount: 49,   status: "Đã thanh toán",    date: "1/3/2026",  color: "#16a34a" },
  { id: "INV-2026-085", tenant: "Gentle Paws Veterinary", plan: "Starter",    amount: 49,   status: "Quá hạn",          date: "28/2/2026", color: "#f97316" },
  { id: "INV-2026-084", tenant: "PetCare Express",        plan: "Enterprise", amount: 599,  status: "Đã thanh toán",    date: "1/2/2026",  color: "#16a34a" },
];

const PIE_DATA = [
  { name: "Enterprise", value: 12600, color: "#7c3aed" },
  { name: "Growth",     value: 20100, color: "#2563EB" },
  { name: "Starter",    value: 2700,  color: "#9ca3af" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "Đã thanh toán": { bg: "rgba(22,163,74,0.08)",  text: "#16a34a" },
  "Thất bại":      { bg: "rgba(220,38,38,0.08)",  text: "#dc2626" },
  "Quá hạn":       { bg: "rgba(249,115,22,0.08)", text: "#ea580c" },
  "Đang xử lý":    { bg: "rgba(107,114,128,0.08)",text: "#6b7280" },
};

export default function AdminBillingPage() {
  const pageRole = (sessionStorage.getItem("adminRole") as "admin" | "staff") || "admin";

  return (
    <AdminPageShell title="Thanh toán" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Thanh toán" }]}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Doanh thu & Thanh toán</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Chu kỳ thanh toán: 1/3/2026 – 31/3/2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
          <Download className="w-3.5 h-3.5" /> Xuất CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-6 gap-4">
        <AdminKPICard label="MRR" value="$34.7k" sub="Tháng hiện tại" icon={CreditCard} color="#2563EB" bg="rgba(37,99,235,0.08)" trend="+10%" trendUp />
        <AdminKPICard label="ARR" value="$417k" sub="Dự kiến năm" icon={TrendingUp} color="#7c3aed" bg="rgba(124,58,237,0.08)" trend="+26%" trendUp />
        <AdminKPICard label="Rời bỏ" value="0.7%" sub="1 tenant tháng này" icon={TrendingDown} color="#dc2626" bg="rgba(220,38,38,0.08)" trend="-0.3%" trendUp />
        <AdminKPICard label="Thanh toán lỗi" value="1" sub="INV-2026-091" icon={AlertTriangle} color="#ea580c" bg="rgba(249,115,22,0.08)" />
        <AdminKPICard label="Số lượng hóa đơn" value="142" sub="Tháng 3" icon={DollarSign} color="#16a34a" bg="rgba(22,163,74,0.08)" />
        <AdminKPICard label="ARPU" value="$244" sub="Doanh thu TB/Tenant" icon={Users} color="#06b6d4" bg="rgba(6,182,212,0.08)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
          <AdminCardHeader title="Xu hướng MRR so với Doanh thu mới & Rời bỏ" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MRR_TREND} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
              <Tooltip formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === "mrr" ? "Tổng MRR" : name === "new" ? "MRR mới" : "Rời bỏ"]} contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.75rem" }} />
              <Bar key="bar-mrr"   name="mrr"   dataKey="mrr"   fill="#dbeafe" radius={[4,4,0,0]} />
              <Bar key="bar-new"   name="new"   dataKey="new"   fill="#2563EB" radius={[4,4,0,0]} />
              <Bar key="bar-churn" name="churn" dataKey="churn" fill="#fca5a5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="MRR theo gói" />
          <div className="flex justify-center mb-4">
            <PieChart width={150} height={150}>
              <Pie data={PIE_DATA} cx={70} cy={70} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={`cell-pie-${i}`} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: "10px", fontSize: "0.75rem" }} />
            </PieChart>
          </div>
          <div className="flex flex-col gap-2.5">
            {PIE_DATA.map(p => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{p.name}</span>
                </div>
                <div className="text-right">
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>${p.value.toLocaleString()}</span>
                  <span style={{ fontSize: "0.62rem", color: "#9ca3af", marginLeft: "4px" }}>{Math.round(p.value / 35400 * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Invoice table */}
      <AdminCard>
        <AdminCardHeader 
          title="Hóa đơn gần đây" 
          action={
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}>
              <Download className="w-3 h-3" /> Xuất
            </button>
          }
        />
        <table className="w-full">
          <thead style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <tr>
              {["Hóa đơn", "Tenant", "Gói", "Số tiền", "Trạng thái", "Ngày", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv, i) => {
              const s = STATUS_STYLES[inv.status];
              return (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: i < INVOICES.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                  <td className="px-5 py-3.5"><span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB" }}>{inv.id}</span></td>
                  <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>{inv.tenant}</span></td>
                  <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{inv.plan}</span></td>
                  <td className="px-5 py-3.5"><span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>${inv.amount}</span></td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full" style={{ background: s.bg, fontSize: "0.65rem", fontWeight: 700, color: s.text }}>{inv.status}</span>
                  </td>
                  <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{inv.date}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50"><Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} /></button>
                      {inv.status === "Thất bại" && <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: "rgba(220,38,38,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#dc2626" }}><RefreshCw className="w-3 h-3" /> Thử lại</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminCard>
    </AdminPageShell>
  );
}
