import { useState, useRef } from "react";
import {
  Search, X, ScrollText, ChevronLeft, ChevronRight,
  Shield, Calendar, Globe, HelpCircle, HardDrive
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { SkeletonTable, AdminCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useActivityLogs } from "@/hooks/admin/useLogs";
import type { ActivityLogParams } from "@/types/admin";
import "@/styles/fonts.css";

const PAGE_SIZE = 15;

const ENTITY_LABEL: Record<string, string> = {
  Tenant: "Cửa hàng (Tenant)",
  SubscriptionPlan: "Gói dịch vụ",
  PlatformInvoice: "Hóa đơn",
  SupportTicket: "Phiếu hỗ trợ",
  PlatformAdmin: "Nhân sự quản trị",
  SystemConfig: "Cấu hình hệ thống",
};

const ENTITY_COLOR: Record<string, string> = {
  Tenant: "#2563EB",
  SubscriptionPlan: "#7c3aed",
  PlatformInvoice: "#16a34a",
  SupportTicket: "#ea580c",
  PlatformAdmin: "#dc2626",
  SystemConfig: "#06b6d4",
};

const ENTITY_BG: Record<string, string> = {
  Tenant: "rgba(37,99,235,0.07)",
  SubscriptionPlan: "rgba(124,58,237,0.07)",
  PlatformInvoice: "rgba(22,163,74,0.07)",
  SupportTicket: "rgba(249,115,22,0.07)",
  PlatformAdmin: "rgba(220,38,38,0.07)",
  SystemConfig: "rgba(6,182,212,0.07)",
};

function LogsContent() {
  const [params, setParams] = useState<ActivityLogParams>({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });
  const [searchInput, setSearchInput] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { data: logsData, isLoading, refetch } = useActivityLogs(params);
  const logs = logsData?.items ?? [];

  function applySearch() {
    setParams(p => ({ ...p, searchTerm: searchInput || undefined, pageNumber: 1 }));
  }

  function setFilter<K extends keyof ActivityLogParams>(key: K, val: ActivityLogParams[K]) {
    setParams(p => ({ ...p, [key]: val || undefined, pageNumber: 1 }));
  }

  function clearFilters() {
    setSearchInput("");
    setParams({ pageNumber: 1, pageSize: PAGE_SIZE });
  }

  const hasFilters = !!(params.searchTerm || params.entityType || params.fromDate || params.toDate);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Nhật ký hoạt động</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            Truy vết vết hành vi kiểm toán (Audit Logs) của các Admin và nhân sự vận hành hệ thống
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 rounded-2xl"
        style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            ref={searchRef}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applySearch()}
            placeholder="Tìm theo hành động, mô tả tác động…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>

        {/* Entity Type Filter */}
        <select
          value={params.entityType ?? ""}
          onChange={e => setFilter("entityType", e.target.value)}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}>
          <option value="">Tất cả thực thể</option>
          <option value="Tenant">Cửa hàng (Tenant)</option>
          <option value="SubscriptionPlan">Gói dịch vụ</option>
          <option value="PlatformInvoice">Hóa đơn</option>
          <option value="SupportTicket">Phiếu hỗ trợ</option>
          <option value="PlatformAdmin">Nhân sự quản trị</option>
          <option value="SystemConfig">Cấu hình hệ thống</option>
        </select>

        {/* From Date */}
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={params.fromDate ?? ""}
            onChange={e => setFilter("fromDate", e.target.value)}
            className="px-3 py-1.5 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}
          />
        </div>

        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>→</span>

        {/* To Date */}
        <input
          type="date"
          value={params.toDate ?? ""}
          onChange={e => setFilter("toDate", e.target.value)}
          className="px-3 py-1.5 rounded-xl outline-none"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.78rem", color: "#374151" }}
        />

        <button
          onClick={applySearch}
          className="px-4 py-2 rounded-xl text-white font-bold transition-all hover:bg-blue-700"
          style={{ background: "#2563EB", fontSize: "0.78rem" }}>
          Lọc
        </button>

        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>
            <X className="w-3.5 h-3.5" /> Xóa lọc
          </button>
        )}
      </div>

      {/* Logs Table */}
      <AdminCard>
        {isLoading ? (
          <SkeletonTable rows={PAGE_SIZE} />
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fafafa" }}>
                {["Thời gian", "Thao tác", "Thực thể", "Nội dung chi tiết", "Địa chỉ IP", "Người thực hiện"].map(h => (
                  <th key={h} className="px-5 py-3 text-left"
                    style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const entityColor = ENTITY_COLOR[log.entityType] ?? "#6b7280";
                const entityBg = ENTITY_BG[log.entityType] ?? "rgba(0,0,0,0.05)";
                const entityLabel = ENTITY_LABEL[log.entityType] ?? log.entityType;

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-blue-50/10 transition-colors"
                    style={{ borderBottom: i < logs.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
                    
                    {/* Timestamp */}
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>
                        {new Date(log.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Action Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>
                          {log.action}
                        </span>
                      </div>
                    </td>

                    {/* Entity Type */}
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-lg"
                        style={{
                          background: entityBg,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: entityColor,
                        }}>
                        {entityLabel}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5" style={{ maxWidth: "280px" }}>
                      <p style={{ fontSize: "0.78rem", color: "#4b5563", lineHeight: 1.4 }} className="truncate" title={log.description}>
                        {log.description || "Không có chi tiết mô tả."}
                      </p>
                    </td>

                    {/* IP Address */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5" style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                        <Globe className="w-3 h-3 text-gray-400" />
                        <span>{log.ipAddress || "—"}</span>
                      </div>
                    </td>

                    {/* Performer actor */}
                    <td className="px-5 py-3.5">
                      <span style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 600 }}>
                        {log.adminId ? `Admin ID: ${log.adminId.slice(0, 8)}…` : log.userId ? `User: ${log.userId.slice(0, 8)}…` : "Hệ thống"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && logs.length === 0 && (
          <div className="px-5 py-12 text-center">
            <ScrollText className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
            <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy lịch sử nhật ký kiểm toán phù hợp.</p>
          </div>
        )}
      </AdminCard>

      {/* Pagination */}
      {(logsData?.totalCount ?? 0) > PAGE_SIZE && (
        <div className="flex items-center justify-between px-1">
          <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
            Trang {logsData?.pageNumber} / {logsData?.totalPages} · {logsData?.totalCount} bản ghi
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={params.pageNumber === 1}
              onClick={() => setFilter("pageNumber", (params.pageNumber ?? 1) - 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              <ChevronLeft className="w-3.5 h-3.5" /> Trước
            </button>
            <button
              disabled={(params.pageNumber ?? 1) >= (logsData?.totalPages ?? 1)}
              onClick={() => setFilter("pageNumber", (params.pageNumber ?? 1) + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
              style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}>
              Tiếp <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminLogsPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell
        title="Nhật ký Hoạt động"
        breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Nhật ký kiểm toán" }]}>
        <LogsContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
