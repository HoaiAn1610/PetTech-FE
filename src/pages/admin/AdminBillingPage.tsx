import { useMemo } from "react";
import {
  CreditCard, TrendingUp, TrendingDown, DollarSign,
  Download, Eye, AlertTriangle, RefreshCw, Users,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useBillingOverview, useInvoices, useRetryPayment } from "@/hooks/admin/useBilling";
import type { Invoice } from "@/types/admin";
import "@/styles/fonts.css";

const INVOICE_STATUS_LABEL: Record<string, string> = {
  Paid: 'Đã thanh toán',
  Failed: 'Thất bại',
  Overdue: 'Quá hạn',
  Processing: 'Đang xử lý',
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Paid:       { bg: "rgba(22,163,74,0.08)",   text: "#16a34a" },
  Failed:     { bg: "rgba(220,38,38,0.08)",   text: "#dc2626" },
  Overdue:    { bg: "rgba(249,115,22,0.08)",  text: "#ea580c" },
  Processing: { bg: "rgba(107,114,128,0.08)", text: "#6b7280" },
};

const PLAN_COLORS: Record<string, string> = {
  Enterprise: "#7c3aed",
  Growth:     "#2563EB",
  Starter:    "#9ca3af",
  Trial:      "#f59e0b",
};

function BillingContent() {
  const { data: billing, isLoading: billingLoading } = useBillingOverview();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices({ page: 1, pageSize: 20 });
  const retryMutation = useRetryPayment();

  const invoices: Invoice[] = invoicesData ?? [];

  const pieData = useMemo(() => {
    if (!billing?.planDistribution) return [];
    return billing.planDistribution.map(p => ({
      name: p.plan,
      value: p.mrr,
      color: PLAN_COLORS[p.plan] ?? "#9ca3af",
    }));
  }, [billing?.planDistribution]);

  const totalMrr = billing?.mrr ?? 0;

  function handleExportCsv() {
    if (!invoices.length) return;
    const header = ["Hóa đơn", "Tenant", "Gói", "Số tiền", "Trạng thái", "Ngày"].join(",");
    const rows = invoices.map(inv =>
      [
        inv.id,
        `"${inv.tenantName}"`,
        inv.plan,
        inv.amount,
        INVOICE_STATUS_LABEL[inv.status] ?? inv.status,
        new Date(inv.issuedAt).toLocaleDateString("vi-VN"),
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Doanh thu & Thanh toán</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Chu kỳ thanh toán hiện tại</p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}
        >
          <Download className="w-3.5 h-3.5" /> Xuất CSV
        </button>
      </div>

      {/* Metrics */}
      {billingLoading ? (
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <AdminKPICard label="MRR" value={`$${(totalMrr / 1000).toFixed(1)}k`} sub="Tháng hiện tại" icon={CreditCard} color="#2563EB" bg="rgba(37,99,235,0.08)" trend={`+${((billing?.arr ?? 0) / Math.max(totalMrr * 12, 1) * 100 - 100).toFixed(0)}%`} trendUp />
          <AdminKPICard label="ARR" value={`$${((billing?.arr ?? 0) / 1000).toFixed(0)}k`} sub="Dự kiến năm" icon={TrendingUp} color="#7c3aed" bg="rgba(124,58,237,0.08)" />
          <AdminKPICard label="Rời bỏ" value={`${billing?.churnRate ?? 0}%`} sub="Tháng này" icon={TrendingDown} color="#dc2626" bg="rgba(220,38,38,0.08)" />
          <AdminKPICard label="Thanh toán lỗi" value={String(billing?.paymentFailures ?? 0)} sub="Cần xử lý" icon={AlertTriangle} color="#ea580c" bg="rgba(249,115,22,0.08)" />
          <AdminKPICard label="Số hóa đơn" value={String(billing?.totalInvoices ?? 0)} sub="Tháng này" icon={DollarSign} color="#16a34a" bg="rgba(22,163,74,0.08)" />
          <AdminKPICard label="ARPU" value={`$${billing?.arpu ?? 0}`} sub="Doanh thu TB/Tenant" icon={Users} color="#06b6d4" bg="rgba(6,182,212,0.08)" />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-3 gap-5">
        <AdminCard className="col-span-2">
          <AdminCardHeader title="Xu hướng MRR so với Doanh thu mới & Rời bỏ" />
          {billingLoading ? (
            <SkeletonCard lines={4} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={billing?.mrrTrend ?? []} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  formatter={(v: number, name: string) => [
                    `$${v.toLocaleString()}`,
                    name === "mrr" ? "Tổng MRR" : name === "newRevenue" ? "MRR mới" : "Rời bỏ",
                  ]}
                  contentStyle={{ borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)", fontSize: "0.75rem" }}
                />
                <Bar dataKey="mrr"        name="mrr"        fill="#dbeafe" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newRevenue" name="newRevenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn"      name="churn"      fill="#fca5a5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader title="MRR theo gói" />
          {billingLoading ? (
            <SkeletonCard lines={4} />
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <PieChart width={150} height={150}>
                  <Pie data={pieData} cx={70} cy={70} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={`cell-pie-${i}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: "10px", fontSize: "0.75rem" }} />
                </PieChart>
              </div>
              <div className="flex flex-col gap-2.5">
                {pieData.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>${p.value.toLocaleString()}</span>
                      <span style={{ fontSize: "0.62rem", color: "#9ca3af", marginLeft: "4px" }}>
                        {totalMrr > 0 ? Math.round(p.value / totalMrr * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* Invoice table */}
      <AdminCard>
        <AdminCardHeader
          title="Hóa đơn gần đây"
          action={
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}
            >
              <Download className="w-3 h-3" /> Xuất
            </button>
          }
        />
        {invoicesLoading ? (
          <SkeletonCard lines={5} />
        ) : (
          <table className="w-full">
            <thead style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
              <tr>
                {["Hóa đơn", "Tenant", "Gói", "Số tiền", "Trạng thái", "Ngày", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const s = STATUS_STYLES[inv.status] ?? { bg: "rgba(107,114,128,0.08)", text: "#6b7280" };
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: i < invoices.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB" }}>{inv.id}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>{inv.tenantName}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{inv.plan}</span></td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>${inv.amount}</span></td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full" style={{ background: s.bg, fontSize: "0.65rem", fontWeight: 700, color: s.text }}>
                        {INVOICE_STATUS_LABEL[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{new Date(inv.issuedAt).toLocaleDateString("vi-VN")}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50">
                          <Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                        </button>
                        {inv.status === "Failed" && (
                          <button
                            onClick={() => retryMutation.mutate(inv.id)}
                            disabled={retryMutation.isPending}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg"
                            style={{ background: "rgba(220,38,38,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#dc2626" }}
                          >
                            <RefreshCw className="w-3 h-3" /> Thử lại
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                    Không có hóa đơn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </AdminCard>
    </>
  );
}

export default function AdminBillingPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Thanh toán" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Thanh toán" }]}>
        <BillingContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
