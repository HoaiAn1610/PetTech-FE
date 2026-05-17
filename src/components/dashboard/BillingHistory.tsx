import { useState } from "react";
import {
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  ChevronDown,
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Processing" | "Failed" | "Refunded";

interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  description: string;
  method: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
}

const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2026-034",
    date: "Mar 4, 2026",
    description: "Growth Plan · Monthly",
    method: "Visa •••• 4242",
    amount: 149.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "2",
    invoiceNo: "INV-2026-021",
    date: "Feb 4, 2026",
    description: "Growth Plan · Monthly",
    method: "Visa •••• 4242",
    amount: 149.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "3",
    invoiceNo: "INV-2026-008",
    date: "Jan 4, 2026",
    description: "Growth Plan · Monthly + Data Migration Add-on",
    method: "Visa •••• 4242",
    amount: 299.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "4",
    invoiceNo: "INV-2025-094",
    date: "Dec 4, 2025",
    description: "Starter Plan · Monthly",
    method: "Mastercard •••• 8811",
    amount: 49.0,
    currency: "USD",
    status: "Refunded",
  },
  {
    id: "5",
    invoiceNo: "INV-2025-081",
    date: "Nov 4, 2025",
    description: "Starter Plan · Monthly",
    method: "Mastercard •••• 8811",
    amount: 49.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "6",
    invoiceNo: "INV-2025-068",
    date: "Oct 4, 2025",
    description: "Starter Plan · Monthly",
    method: "Mastercard •••• 8811",
    amount: 49.0,
    currency: "USD",
    status: "Paid",
  },
  {
    id: "7",
    invoiceNo: "INV-2025-055",
    date: "Sep 4, 2025",
    description: "Starter Plan · Annual Upgrade",
    method: "Bank Transfer",
    amount: 588.0,
    currency: "USD",
    status: "Processing",
  },
  {
    id: "8",
    invoiceNo: "INV-2025-040",
    date: "Aug 4, 2025",
    description: "Starter Plan · Monthly",
    method: "Mastercard •••• 8811",
    amount: 49.0,
    currency: "USD",
    status: "Failed",
  },
];

const statusConfig: Record<
  InvoiceStatus,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  Paid:       { icon: CheckCircle2, color: "#16a34a", bg: "rgba(22,163,74,0.1)",    label: "Đã thanh toán" },
  Processing: { icon: Clock,        color: "#d97706", bg: "rgba(217,119,6,0.1)",    label: "Đang xử lý"    },
  Failed:     { icon: XCircle,      color: "#dc2626", bg: "rgba(220,38,38,0.1)",    label: "Thất bại"      },
  Refunded:   { icon: CreditCard,   color: "#7c3aed", bg: "rgba(124,58,237,0.1)",  label: "Hoàn tiền"     },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ background: cfg.bg, fontSize: "0.75rem", fontWeight: 700, color: cfg.color }}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function DownloadButton({ invoice }: { invoice: Invoice }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (invoice.status === "Processing" || invoice.status === "Failed") return;
    setDownloading(true);
    setTimeout(() => setDownloading(false), 1500);
  };

  const disabled = invoice.status === "Processing" || invoice.status === "Failed";

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      title={disabled ? "Not available" : `Download ${invoice.invoiceNo}`}
      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200"
      style={{
        background: disabled ? "transparent" : "rgba(37,99,235,0.06)",
        border: `1px solid ${disabled ? "transparent" : "rgba(37,99,235,0.15)"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
      }}
    >
      {downloading ? (
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{ borderColor: "#2563EB", borderTopColor: "transparent" }}
        />
      ) : (
        <Download
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{ color: "#2563EB" }}
          strokeWidth={2}
        />
      )}
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2563EB" }}>
        {downloading ? "…" : "PDF"}
      </span>
    </button>
  );
}

export function BillingHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const perPage = 6;

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, i) => acc + i.amount, 0);

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden"
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-8 py-6 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.08)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#2563EB" }} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-gray-900" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  Lịch sử thanh toán
                </h3>
                <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                  {invoices.length} hoá đơn · ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })} đã thanh toán
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "#9ca3af" }}
              />
              <input
                type="text"
                placeholder="Tìm hoá đơn…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 rounded-xl outline-none transition-all focus:ring-2"
                style={{
                  background: "#f9fafb",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  fontSize: "0.83rem",
                  color: "#374151",
                  width: "200px",
                  // @ts-ignore
                  "--tw-ring-color": "rgba(37,99,235,0.2)",
                }}
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as InvoiceStatus | "All"); setCurrentPage(1); }}
                className="pl-8 pr-8 py-2 rounded-xl appearance-none outline-none cursor-pointer"
                style={{
                  background: "#f9fafb",
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  fontSize: "0.83rem",
                  color: "#374151",
                }}
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Processing">Đang xử lý</option>
                <option value="Failed">Thất bại</option>
                <option value="Refunded">Hoàn tiền</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "#9ca3af" }} />
            </div>

            {/* Export */}
            <button
              onClick={() => {
                if (exporting || exported) return;
                setExporting(true);
                setTimeout(() => { setExporting(false); setExported(true); setTimeout(() => setExported(false), 2500); }, 1400);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-px hover:shadow-sm"
              style={{
                background: exported ? "#16a34a" : "#2563EB",
                fontSize: "0.83rem",
                fontWeight: 600,
                color: "white",
                border: "none",
                minWidth: "110px",
              }}
            >
              {exporting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
              ) : exported ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              {exporting ? "Đang xuất…" : exported ? "Đã xuất!" : "Xuất tất cả"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {[
                { label: "Hoá đơn",          width: "160px" },
                { label: "Ngày",             width: "130px" },
                { label: "Mô tả",            width: ""      },
                { label: "Phương thức TT",   width: "180px" },
                { label: "Số tiền",          width: "110px" },
                { label: "Trạng thái",       width: "130px" },
                { label: "Tải xuống",        width: "110px" },
              ].map((col) => (
                <th
                  key={col.label}
                  className="text-left px-6 py-4"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#6b7280",
                    letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                    width: col.width || undefined,
                  }}
                >
                  {col.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16">
                  <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "#d1d5db" }} />
                  <p style={{ fontSize: "0.9rem", color: "#9ca3af", fontWeight: 500 }}>
                    Không tìm thấy hoá đơn
                  </p>
                </td>
              </tr>
            ) : (
              paginated.map((inv, idx) => (
                <tr
                  key={inv.id}
                  className="group transition-colors hover:bg-blue-50/50"
                  style={{
                    borderBottom: idx < paginated.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  {/* Invoice # */}
                  <td className="px-6 py-4">
                    <span
                      className="font-mono px-2.5 py-1 rounded-lg"
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#374151",
                        background: "#f3f4f6",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {inv.invoiceNo}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span style={{ fontSize: "0.83rem", color: "#374151", fontWeight: 500 }}>
                      {inv.date}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4">
                    <span style={{ fontSize: "0.83rem", color: "#374151" }}>
                      {inv.description}
                    </span>
                  </td>

                  {/* Method */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: "#9ca3af" }} />
                      <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{inv.method}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
                      ${inv.amount.toFixed(2)}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#9ca3af", marginLeft: "2px" }}>
                      {inv.currency}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>

                  {/* Download */}
                  <td className="px-6 py-4">
                    <DownloadButton invoice={inv} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className="px-8 py-4 flex items-center justify-between border-t"
        style={{ borderColor: "rgba(0,0,0,0.06)", background: "#fafafa" }}
      >
        <p style={{ fontSize: "0.78rem", color: "#6b7280" }}>
          Hiển thị{" "}
          <span style={{ fontWeight: 700, color: "#374151" }}>
            {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)}
          </span>{" "}
          trong <span style={{ fontWeight: 700, color: "#374151" }}>{filtered.length}</span> hoá đơn
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
              style={{
                background: page === currentPage ? "#2563EB" : "transparent",
                color: page === currentPage ? "white" : "#6b7280",
                fontSize: "0.8rem",
                fontWeight: page === currentPage ? 700 : 500,
                border: page === currentPage ? "none" : "1px solid transparent",
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}