import { useMemo, useState } from "react";
import {
  CreditCard, DollarSign, Download, Eye, AlertTriangle, RefreshCw,
  TrendingUp, Search, X, CheckCircle2, Clock, XCircle, Loader2,
  Receipt, Building2,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, SkeletonCard, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useInvoices, useInvoiceDetail, useRetryPayment, useBillingSummary } from "@/hooks/admin/useBilling";
import { usePlans } from "@/hooks/admin/usePlans";
import type { Invoice, InvoiceListParams, InvoiceStatus } from "@/types/admin";
import "@/styles/fonts.css";

const INVOICE_STATUS_LABEL: Record<string, string> = {
  paid:       "Đã thanh toán",
  failed:     "Thất bại",
  overdue:    "Quá hạn",
  processing: "Đang xử lý",
  pending:    "Chờ xử lý",
  refunded:   "Hoàn tiền",
  Paid:       "Đã thanh toán",
  Failed:     "Thất bại",
  Overdue:    "Quá hạn",
  Processing: "Đang xử lý",
  Pending:    "Chờ xử lý",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  paid:       { bg: "rgba(22,163,74,0.08)",   text: "#16a34a", icon: CheckCircle2 },
  failed:     { bg: "rgba(220,38,38,0.08)",   text: "#dc2626", icon: XCircle      },
  overdue:    { bg: "rgba(249,115,22,0.08)",  text: "#ea580c", icon: AlertTriangle },
  processing: { bg: "rgba(107,114,128,0.08)", text: "#6b7280", icon: Loader2      },
  pending:    { bg: "rgba(37,99,235,0.08)",   text: "#2563EB", icon: Clock        },
  refunded:   { bg: "rgba(107,114,128,0.08)", text: "#6b7280", icon: Clock        },
  Paid:       { bg: "rgba(22,163,74,0.08)",   text: "#16a34a", icon: CheckCircle2 },
  Failed:     { bg: "rgba(220,38,38,0.08)",   text: "#dc2626", icon: XCircle      },
  Overdue:    { bg: "rgba(249,115,22,0.08)",  text: "#ea580c", icon: AlertTriangle },
  Processing: { bg: "rgba(107,114,128,0.08)", text: "#6b7280", icon: Loader2      },
  Pending:    { bg: "rgba(37,99,235,0.08)",   text: "#2563EB", icon: Clock        },
};

const DEFAULT_STATUS_STYLE = STATUS_STYLES.pending;

const PLAN_COLORS = ["#2563EB", "#7c3aed", "#9ca3af", "#f97316", "#06b6d4", "#16a34a"];

function formatVnd(amount: number) {
  return amount > 0 ? amount.toLocaleString("vi-VN") + " ₫" : "0 ₫";
}

// ─── Invoice Detail Modal ──────────────────────────────────────────────────────

function InvoiceDetailModal({ invoiceId, onClose, onRetry }: {
  invoiceId: string;
  onClose: () => void;
  onRetry: (id: string) => void;
}) {
  const { data: inv, isLoading } = useInvoiceDetail(invoiceId);
  const s = inv ? (STATUS_STYLES[inv.status] ?? DEFAULT_STATUS_STYLE) : DEFAULT_STATUS_STYLE;
  const StatusIcon = s.icon;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(37,99,235,0.08)" }}>
              <Receipt className="w-4 h-4" style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                {isLoading ? "Đang tải…" : inv?.invoiceNumber || "Chi tiết hóa đơn"}
              </h3>
              <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Chi tiết hóa đơn nền tảng</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {isLoading ? (
            <SkeletonCard lines={4} />
          ) : inv ? (
            <>
              {/* Status + Amount hero */}
              <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{ background: s.bg, border: `1.5px solid ${s.text}20` }}>
                <div className="flex items-center gap-2.5">
                  <StatusIcon className="w-5 h-5" style={{ color: s.text }} />
                  <div>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: s.text, letterSpacing: "0.06em" }}>
                      {INVOICE_STATUS_LABEL[inv.status] ?? inv.status}
                    </p>
                    <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                      {formatVnd(inv.amount)}
                    </p>
                  </div>
                </div>
                {inv.paidAt && (
                  <div className="text-right">
                    <p style={{ fontSize: "0.6rem", color: "#9ca3af", fontWeight: 600 }}>ĐÃ THANH TOÁN LÚC</p>
                    <p style={{ fontSize: "0.72rem", color: "#374151", fontWeight: 700 }}>
                      {new Date(inv.paidAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "TENANT",    value: inv.tenantName },
                  { label: "GÓI",       value: inv.planName ?? "—" },
                  { label: "TẠO LÚC",   value: new Date(inv.createdAt).toLocaleString("vi-VN") },
                  { label: "ID HÓA ĐƠN", value: inv.id.slice(0, 18) + "…" },
                ].map(r => (
                  <div key={r.label} className="px-4 py-3 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <p style={{ fontSize: "0.58rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{r.label}</p>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", marginTop: "2px", wordBreak: "break-all" }}>{r.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {inv.status === "Failed" && (
                <button
                  onClick={() => { onRetry(inv.id); onClose(); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold"
                  style={{ background: "rgba(220,38,38,0.08)", border: "1.5px solid rgba(220,38,38,0.2)", color: "#dc2626", fontSize: "0.85rem" }}>
                  <RefreshCw className="w-4 h-4" /> Thử lại thanh toán
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Billing Content ───────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

function BillingContent() {
  const [filters, setFilters] = useState<InvoiceListParams>({
    pageNumber: 1, pageSize: PAGE_SIZE,
  });
  const [invoiceNumberInput, setInvoiceNumberInput] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId]   = useState<string | null>(null);

  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(filters);
  const { data: plansData,    isLoading: plansLoading    } = usePlans({ pageSize: 100 });
  const { data: summaryData,  isLoading: summaryLoading  } = useBillingSummary();
  const retryMutation = useRetryPayment();

  const invoices: Invoice[] = invoicesData?.items ?? [];
  const plans = plansData?.items ?? [];

  const pieData = useMemo(() => plans.map((p, i) => ({
    name:  p.name,
    value: p.priceMonthly,
    color: PLAN_COLORS[i % PLAN_COLORS.length],
  })), [plans]);

  const totalPriceSum = plans.reduce((s, p) => s + p.priceMonthly, 0);
  const activePlans   = plans.filter(p => p.isActive).length;

  function applySearch() {
    setFilters(f => ({ ...f, invoiceNumber: invoiceNumberInput || undefined, pageNumber: 1 }));
  }

  function clearFilters() {
    setInvoiceNumberInput("");
    setFilters({ pageNumber: 1, pageSize: PAGE_SIZE });
  }

  function handleExportCsv() {
    if (!invoices.length) return;
    const header = ["Hóa đơn", "Tenant", "Gói", "Số tiền", "Trạng thái", "Ngày tạo", "Ngày TT"].join(",");
    const rows = invoices.map(inv =>
      [
        inv.invoiceNumber || inv.id,
        `"${inv.tenantName}"`,
        inv.planName ?? "—",
        inv.amount,
        INVOICE_STATUS_LABEL[inv.status] ?? inv.status,
        new Date(inv.createdAt).toLocaleDateString("vi-VN"),
        inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("vi-VN") : "—",
      ].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `invoices-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  const hasActiveFilters = !!(filters.invoiceNumber || filters.status || filters.paymentMethod || filters.fromDate || filters.toDate);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>
            Doanh thu & Thanh toán
          </h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            Quản lý gói cước và hóa đơn nền tảng
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
          <Download className="w-3.5 h-3.5" /> Xuất CSV
        </button>
      </div>

      {/* KPI cards */}
      {plansLoading || invoicesLoading || summaryLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Doanh thu", value: formatVnd(summaryData?.totalRevenue ?? 0), sub: "Toàn hệ thống",       icon: TrendingUp,    color: "#16a34a", bg: "rgba(22,163,74,0.08)"   },
            { label: "Tổng hóa đơn",          value: String(invoicesData?.totalCount ?? invoices.length), sub: "Tất cả thời gian", icon: DollarSign,    color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
            { label: "Thanh toán lỗi",         value: String(summaryData?.failedInvoices ?? 0),   sub: "Cần xử lý ngay",                      icon: AlertTriangle, color: "#dc2626", bg: "rgba(220,38,38,0.08)"  },
            { label: "Gói đang hoạt động",     value: String(activePlans),   sub: `/ ${plans.length} tổng gói`,          icon: CreditCard,    color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
          ].map(kpi => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white"
                style={{ border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                  <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontSize: "1.1rem", fontWeight: 900, color: kpi.color, letterSpacing: "-0.03em", lineHeight: 1, wordBreak: "break-all" }}>{kpi.value}</p>
                  <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af", marginTop: "2px" }}>{kpi.label}</p>
                  <p style={{ fontSize: "0.6rem", color: "#d1d5db" }}>{kpi.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Invoice status breakdown */}
        <AdminCard className="col-span-2">
          <AdminCardHeader title="Phân bổ hóa đơn theo trạng thái (Trang này)" />
          {invoicesLoading ? <SkeletonCard lines={5} /> : (
            <div className="flex flex-col gap-3 py-3">
              {(["paid", "failed", "overdue", "processing", "pending"] as const).map(status => {
                const count = invoices.filter(inv => inv.status?.toLowerCase() === status).length;
                const pct   = invoices.length > 0 ? Math.round(count / invoices.length * 100) : 0;
                const st    = STATUS_STYLES[status] ?? DEFAULT_STATUS_STYLE;
                const Icon  = st.icon;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5" style={{ minWidth: "130px" }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: st.text }} />
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>
                        {INVOICE_STATUS_LABEL[status]}
                      </span>
                    </div>
                    <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(0,0,0,0.05)" }}>
                      <div className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: st.text }} />
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#9ca3af", minWidth: "68px", textAlign: "right" }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
              {invoices.length === 0 && (
                <p style={{ fontSize: "0.8rem", color: "#9ca3af", textAlign: "center", padding: "16px 0" }}>
                  Chưa có hóa đơn nào trong bộ lọc hiện tại.
                </p>
              )}
            </div>
          )}
        </AdminCard>

        {/* Plan price distribution */}
        <AdminCard>
          <AdminCardHeader title="Phân bổ giá gói" />
          {plansLoading ? <SkeletonCard lines={4} /> : (
            <>
              <div className="flex justify-center my-2">
                <PieChart width={140} height={140}>
                  <Pie data={pieData} cx={65} cy={65} innerRadius={42} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => [formatVnd(v), ""]}
                    contentStyle={{ borderRadius: "10px", fontSize: "0.75rem", border: "1px solid rgba(0,0,0,0.08)" }}
                  />
                </PieChart>
              </div>
              <div className="flex flex-col gap-2">
                {pieData.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}>{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#111827" }}>{formatVnd(p.value)}</span>
                      <span style={{ fontSize: "0.6rem", color: "#9ca3af", marginLeft: "4px" }}>
                        {totalPriceSum > 0 ? Math.round(p.value / totalPriceSum * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
                {pieData.length === 0 && (
                  <p style={{ fontSize: "0.78rem", color: "#9ca3af", textAlign: "center", padding: "8px 0" }}>
                    Chưa có gói nào.
                  </p>
                )}
              </div>
            </>
          )}
        </AdminCard>
      </div>

      {/* Invoice table */}
      <AdminCard>
        <AdminCardHeader title="Danh sách hóa đơn" />

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            <input
              value={invoiceNumberInput}
              onChange={e => setInvoiceNumberInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applySearch()}
              placeholder="Số hóa đơn…"
              className="pl-8 pr-3 py-1.5 rounded-xl outline-none"
              style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#111827", width: "160px" }}
            />
          </div>

          <select
            value={filters.status ?? ""}
            onChange={e => setFilters(f => ({ ...f, status: (e.target.value as InvoiceStatus) || undefined, pageNumber: 1 }))}
            className="px-3 py-1.5 rounded-xl outline-none cursor-pointer"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}>
            <option value="">Tất cả trạng thái</option>
            {(["paid", "failed", "overdue", "processing", "pending"] as const).map(s => (
              <option key={s} value={s}>{INVOICE_STATUS_LABEL[s]}</option>
            ))}
          </select>

          <select
            value={filters.paymentMethod ?? ""}
            onChange={e => setFilters(f => ({ ...f, paymentMethod: e.target.value || undefined, pageNumber: 1 }))}
            className="px-3 py-1.5 rounded-xl outline-none cursor-pointer"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}>
            <option value="">Phương thức TT</option>
            <option value="Card">Thẻ</option>
            <option value="BankTransfer">Chuyển khoản</option>
            <option value="Cash">Tiền mặt</option>
          </select>

          <input type="date" value={filters.fromDate ?? ""}
            onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value || undefined, pageNumber: 1 }))}
            className="px-3 py-1.5 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}
          />
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>→</span>
          <input type="date" value={filters.toDate ?? ""}
            onChange={e => setFilters(f => ({ ...f, toDate: e.target.value || undefined, pageNumber: 1 }))}
            className="px-3 py-1.5 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}
          />

          <button onClick={applySearch}
            className="px-3 py-1.5 rounded-xl"
            style={{ background: "#2563EB", color: "white", fontSize: "0.75rem", fontWeight: 600 }}>
            Tìm
          </button>

          {(hasActiveFilters || invoiceNumberInput) && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-colors"
              style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>
              <X className="w-3 h-3" /> Xóa lọc
            </button>
          )}
        </div>

        {/* Table */}
        {invoicesLoading ? <SkeletonTable rows={6} /> : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                {["Hóa đơn", "Tenant", "Gói", "Số tiền", "Trạng thái", "Ngày tạo", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left"
                    style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", background: "#fafafa" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const s    = STATUS_STYLES[inv.status] ?? DEFAULT_STATUS_STYLE;
                return (
                  <tr key={inv.id}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                    style={{ borderBottom: i < invoices.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                    onClick={() => setSelectedInvoiceId(inv.id)}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#9ca3af" }} />
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB" }}>
                          {inv.invoiceNumber || inv.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>{inv.tenantName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{inv.planName ?? "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{formatVnd(inv.amount)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, fontSize: "0.65rem", fontWeight: 700, color: s.text }}>
                        {INVOICE_STATUS_LABEL[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        {new Date(inv.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                          onClick={() => setSelectedInvoiceId(inv.id)}
                          title="Xem chi tiết">
                          <Eye className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                        </button>
                        {inv.status === "Failed" && (
                          <button
                            onClick={() => retryMutation.mutate(inv.id)}
                            disabled={retryMutation.isPending}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg disabled:opacity-50"
                            style={{ background: "rgba(220,38,38,0.08)", fontSize: "0.65rem", fontWeight: 700, color: "#dc2626" }}>
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
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Receipt className="w-7 h-7 mx-auto mb-3" style={{ color: "#d1d5db" }} />
                    <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Không có hóa đơn phù hợp.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!invoicesLoading && (invoicesData?.totalCount ?? 0) > PAGE_SIZE && (
          <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
              Trang {invoicesData?.pageNumber} / {invoicesData?.totalPages} · {invoicesData?.totalCount} hóa đơn
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!invoicesData?.hasPreviousPage}
                onClick={() => setFilters(f => ({ ...f, pageNumber: (f.pageNumber ?? 1) - 1 }))}
                className="px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                ← Trước
              </button>
              <button
                disabled={!invoicesData?.hasNextPage}
                onClick={() => setFilters(f => ({ ...f, pageNumber: (f.pageNumber ?? 1) + 1 }))}
                className="px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
                Tiếp →
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Invoice detail modal */}
      {selectedInvoiceId && (
        <InvoiceDetailModal
          invoiceId={selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
          onRetry={(id) => { retryMutation.mutate(id); setSelectedInvoiceId(null); }}
        />
      )}
    </>
  );
}

export default function AdminBillingPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell
        title="Thanh toán"
        breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Doanh thu & Thanh toán" }]}>
        <BillingContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
