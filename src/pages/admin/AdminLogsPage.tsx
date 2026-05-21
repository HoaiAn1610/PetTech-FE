import { useState } from "react";
import { Search, Download, RefreshCw } from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminCard, AdminCardHeader, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useActivityLogs } from "@/hooks/admin/useLogs";
import type { ActivityLog, LogEventType, LogListParams } from "@/types/admin";
import "@/styles/fonts.css";

const EVENT_LABEL: Record<LogEventType, string> = {
  Auth:    "Đăng nhập",
  Tenant:  "Tenant",
  Billing: "Thanh toán",
  Plan:    "Gói cước",
  Support: "Hỗ trợ",
  System:  "Hệ thống",
};

const EVENT_STYLE: Record<LogEventType, { bg: string; text: string }> = {
  Auth:    { bg: "rgba(124,58,237,0.08)",  text: "#7c3aed" },
  Tenant:  { bg: "rgba(37,99,235,0.08)",   text: "#2563EB" },
  Billing: { bg: "rgba(220,38,38,0.08)",   text: "#dc2626" },
  Plan:    { bg: "rgba(22,163,74,0.08)",   text: "#16a34a" },
  Support: { bg: "rgba(249,115,22,0.08)",  text: "#ea580c" },
  System:  { bg: "rgba(6,182,212,0.08)",   text: "#0891b2" },
};

const TIME_RANGES: { label: string; value: LogListParams["timeRange"] }[] = [
  { label: "24 giờ", value: "24h" },
  { label: "7 ngày", value: "7d"  },
  { label: "30 ngày", value: "30d" },
];

const EVENT_TYPES: { label: string; value: LogEventType | "" }[] = [
  { label: "Tất cả",     value: "" },
  { label: "Đăng nhập",  value: "Auth"    },
  { label: "Tenant",     value: "Tenant"  },
  { label: "Thanh toán", value: "Billing" },
  { label: "Gói cước",   value: "Plan"    },
  { label: "Hỗ trợ",    value: "Support" },
  { label: "Hệ thống",   value: "System"  },
];

const PAGE_SIZE = 50;

function LogsContent() {
  const [search,    setSearch]    = useState("");
  const [eventType, setEventType] = useState<LogEventType | "">("");
  const [timeRange, setTimeRange] = useState<LogListParams["timeRange"]>("7d");
  const [page,      setPage]      = useState(1);

  const params: LogListParams = {
    page,
    pageSize: PAGE_SIZE,
    type:     eventType || undefined,
    timeRange,
  };

  const { data: logsData, isLoading, refetch, isFetching } = useActivityLogs(params);
  const logs: ActivityLog[] = logsData?.items ?? [];

  const filtered: ActivityLog[] = search
    ? logs.filter(l => l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase()))
    : logs;

  function handleExportCsv() {
    if (!filtered.length) return;
    const header = ["Thời gian", "Loại", "Người dùng", "Hành động", "IP"].join(",");
    const rows = filtered.map(l =>
      [
        new Date(l.timestamp).toLocaleString("vi-VN"),
        EVENT_LABEL[l.type] ?? l.type,
        `"${l.actor}"`,
        `"${l.action}"`,
        l.ip ?? "",
      ].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Nhật ký hoạt động</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>Theo dõi mọi hành động trên nền tảng</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} /> Làm mới
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}
          >
            <Download className="w-3.5 h-3.5" /> Xuất CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl flex-wrap" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo hành động hoặc người dùng…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>

        {/* Event type */}
        <select
          value={eventType}
          onChange={e => { setEventType(e.target.value as LogEventType | ""); setPage(1); }}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          {EVENT_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Time range */}
        <div className="flex items-center gap-1">
          {TIME_RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => { setTimeRange(r.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg"
              style={{ background: timeRange === r.value ? "#2563EB" : "white", color: timeRange === r.value ? "white" : "#6b7280", fontSize: "0.72rem", fontWeight: 700, border: timeRange === r.value ? "none" : "1.5px solid rgba(0,0,0,0.08)" }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <AdminCard>
        <AdminCardHeader
          title={`${filtered.length} bản ghi`}
          subtitle={`Lọc theo: ${eventType ? EVENT_LABEL[eventType] : "Tất cả"} · ${TIME_RANGES.find(r => r.value === timeRange)?.label}`}
        />
        {isLoading ? (
          <SkeletonTable rows={8} />
        ) : (
          <>
            <table className="w-full">
              <thead style={{ background: "#fafafa", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  {["Thời gian", "Loại", "Người dùng", "Hành động", "IP"].map(h => (
                    <th key={h} className="px-5 py-3 text-left" style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const s = EVENT_STYLE[log.type] ?? { bg: "rgba(0,0,0,0.05)", text: "#6b7280" };
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                      <td className="px-5 py-3">
                        <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontVariantNumeric: "tabular-nums" }}>
                          {new Date(log.timestamp).toLocaleString("vi-VN")}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full" style={{ background: s.bg, fontSize: "0.62rem", fontWeight: 700, color: s.text }}>
                          {EVENT_LABEL[log.type] ?? log.type}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{log.actor}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span style={{ fontSize: "0.78rem", color: "#111827" }}>{log.action}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "monospace" }}>{log.ip ?? "—"}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center" style={{ fontSize: "0.82rem", color: "#9ca3af" }}>
                      Không có bản ghi nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {logs.length === PAGE_SIZE && (
              <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg"
                  style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.72rem", fontWeight: 600, color: page === 1 ? "#d1d5db" : "#374151" }}
                >
                  ← Trước
                </button>
                <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Trang {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg"
                  style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.72rem", fontWeight: 600, color: "#374151" }}
                >
                  Tiếp →
                </button>
              </div>
            )}
          </>
        )}
      </AdminCard>
    </>
  );
}

export default function AdminLogsPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Nhật ký" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Nhật ký" }]}>
        <LogsContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
