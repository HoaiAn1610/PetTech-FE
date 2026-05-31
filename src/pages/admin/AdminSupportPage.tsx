import { useState, useRef } from "react";
import {
  LifeBuoy, AlertTriangle, Clock, CheckCircle2, X,
  Search, User, ChevronRight, Tag,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminStatusBadge, SkeletonTable, SkeletonCard } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useSupportTickets, useTicketDetail, useUpdateTicketStatus, useReplySupportTicket } from "@/hooks/admin/useSupport";
import type { TicketListParams, TicketStatus, TicketPriority } from "@/types/admin";
import "@/styles/fonts.css";

const STATUS_LABEL: Record<TicketStatus, string> = {
  open:       "Đang mở",
  inprogress: "Đang xử lý",
  resolved:   "Đã giải quyết",
  closed:     "Đã đóng",
};

const STATUS_TYPE: Record<TicketStatus, "info" | "warning" | "success" | "neutral"> = {
  open:       "info",
  inprogress: "warning",
  resolved:   "success",
  closed:     "neutral",
};

const STATUS_STYLES: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  open:       { bg: "rgba(37,99,235,0.07)",   text: "#2563EB", border: "rgba(37,99,235,0.15)"  },
  inprogress: { bg: "rgba(249,115,22,0.07)",  text: "#ea580c", border: "rgba(249,115,22,0.15)" },
  resolved:   { bg: "rgba(22,163,74,0.07)",   text: "#16a34a", border: "rgba(22,163,74,0.15)"  },
  closed:     { bg: "rgba(107,114,128,0.07)", text: "#6b7280", border: "rgba(107,114,128,0.15)"},
};

const DEFAULT_STATUS_STYLE = STATUS_STYLES.open;

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  high:   "Cao",
  urgent: "Khẩn cấp",
  medium: "Trung bình",
  low:    "Thấp",
};

const PRIORITY_STYLES: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  high:   { bg: "rgba(220,38,38,0.08)",   text: "#dc2626", border: "rgba(220,38,38,0.2)"  },
  urgent: { bg: "rgba(153,27,27,0.1)",    text: "#991b1b", border: "rgba(153,27,27,0.25)" },
  medium: { bg: "rgba(249,115,22,0.08)",  text: "#ea580c", border: "rgba(249,115,22,0.2)" },
  low:    { bg: "rgba(107,114,128,0.08)", text: "#6b7280", border: "rgba(107,114,128,0.2)"},
};

const DEFAULT_PRIORITY_STYLE = PRIORITY_STYLES.medium;

const PRIORITY_BAR: Record<TicketPriority, string> = {
  high: "#dc2626", urgent: "#7f1d1d", medium: "#f97316", low: "#9ca3af",
};

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────

function TicketDetailModal({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const { data: ticket, isLoading } = useTicketDetail(ticketId);
  const updateMutation = useUpdateTicketStatus();
  const replyMutation = useReplySupportTicket();
  const [replyMessage, setReplyMessage] = useState("");

  function handleStatusChange(status: TicketStatus) {
    updateMutation.mutate({ id: ticketId, data: { status } });
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    replyMutation.mutate({ id: ticketId, message: replyMessage.trim() }, {
      onSuccess: () => {
        setReplyMessage("");
      }
    });
  }

  if (!ticket && !isLoading) return null;

  const priority = ticket ? (PRIORITY_STYLES[ticket.priority] ?? DEFAULT_PRIORITY_STYLE) : DEFAULT_PRIORITY_STYLE;
  const status   = ticket ? (STATUS_STYLES[ticket.status]   ?? DEFAULT_STATUS_STYLE)   : DEFAULT_STATUS_STYLE;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          {isLoading || !ticket ? (
            <div className="h-24 animate-pulse bg-gray-100 rounded-xl" />
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563EB" }}>
                      #{ticket.ticketNumber || ticket.id.slice(0, 8)}
                    </span>
                    {/* Status badge — updates optimistically */}
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: status.bg, border: `1px solid ${status.border}`, fontSize: "0.62rem", fontWeight: 700, color: status.text, transition: "all 0.15s" }}
                    >
                      {STATUS_LABEL[ticket.status]}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: priority.bg, border: `1px solid ${priority.border}`, fontSize: "0.62rem", fontWeight: 700, color: priority.text }}
                    >
                      Ưu tiên {PRIORITY_LABEL[ticket.priority]}
                    </span>
                    {ticket.category && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.07)", fontSize: "0.62rem", fontWeight: 600, color: "#7c3aed" }}>
                        <Tag className="w-2.5 h-2.5" /> {ticket.category}
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{ticket.subject}</h2>
                  <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "4px" }}>
                    {ticket.tenantName && <>{ticket.tenantName} · </>}
                    Mở lúc {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                    {ticket.resolvedAt && <> · Giải quyết {new Date(ticket.resolvedAt).toLocaleString("vi-VN")}</>}
                  </p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
                  <X className="w-4 h-4" style={{ color: "#6b7280" }} />
                </button>
              </div>

              {/* Meta row: assignee + status changer */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {ticket.submittedByName && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b7280" }}>{ticket.submittedByName}</span>
                  </div>
                )}
                {ticket.assignedTo && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#2563EB" }}>Phân công: {ticket.assignedTo}</span>
                  </div>
                )}

                {/* Status dropdown — always visible, optimistic */}
                <div className="ml-auto flex items-center gap-2">
                  <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600 }}>Đổi trạng thái:</span>
                  <select
                    value={ticket.status}
                    onChange={e => handleStatusChange(e.target.value as TicketStatus)}
                    disabled={updateMutation.isPending}
                    className="px-3 py-1.5 rounded-xl outline-none cursor-pointer"
                    style={{
                      background: status.bg,
                      border: `1px solid ${status.border}`,
                      fontSize: "0.72rem", fontWeight: 700, color: status.text,
                      transition: "all 0.15s",
                    }}
                  >
                    {(["open", "inprogress", "resolved", "closed"] as TicketStatus[]).map(s => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Dialogue Thread ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map(i => <div key={i} className="h-12 animate-pulse bg-gray-100 rounded-xl" />)}
            </div>
          ) : ticket ? (
            <>
              {/* Khách hàng nói */}
              <div className="flex flex-col gap-1 max-w-[85%] self-start">
                <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", marginLeft: "8px" }}>
                  {ticket.tenantName || "KHÁCH HÀNG"} · {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                </span>
                <div className="rounded-2xl px-5 py-4" style={{ background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.04)" }}>
                  <p style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {ticket.description || "Không có mô tả."}
                  </p>
                </div>
              </div>

              {/* Admin phản hồi */}
              {ticket.adminReply ? (
                <div className="flex flex-col gap-1 max-w-[85%] self-end items-end">
                  <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#2563EB", marginRight: "8px" }}>
                    ADMIN PETTECH · {ticket.repliedAt ? new Date(ticket.repliedAt).toLocaleString("vi-VN") : "Gần đây"}
                  </span>
                  <div className="rounded-2xl px-5 py-4" style={{ background: "rgba(37,99,235,0.06)", border: "1.5px solid rgba(37,99,235,0.12)" }}>
                    <p style={{ fontSize: "0.82rem", color: "#1e40af", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {ticket.adminReply}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 italic">
                  Chưa có phản hồi từ Ban quản trị PetTech.
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* ── Reply Input Box ── */}
        {!isLoading && ticket && (
          <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "#f9fafb" }}>
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Nhập câu trả lời gửi đến khách hàng..."
                className="flex-1 px-4 py-2.5 rounded-xl outline-none"
                style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#111827", background: "white" }}
                disabled={replyMutation.isPending}
              />
              <button
                type="submit"
                disabled={replyMutation.isPending || !replyMessage.trim()}
                className="px-5 py-2.5 rounded-xl font-bold transition-all hover:-translate-y-px disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.2)" }}
              >
                {replyMutation.isPending ? "Đang gửi…" : "Phản hồi"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Support Content ──────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

function SupportContent() {
  const [params, setParams] = useState<TicketListParams>({
    pageNumber: 1, pageSize: PAGE_SIZE,
  });
  const [searchInput, setSearchInput] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: ticketsData, isLoading } = useSupportTickets(params);
  const tickets = ticketsData?.items ?? [];

  function applySearch() {
    setParams(p => ({ ...p, searchTerm: searchInput || undefined, pageNumber: 1 }));
  }

  function setFilter<K extends keyof TicketListParams>(key: K, val: TicketListParams[K]) {
    setParams(p => ({ ...p, [key]: val || undefined, pageNumber: 1 }));
  }

  function clearFilters() {
    setSearchInput("");
    setParams({ pageNumber: 1, pageSize: PAGE_SIZE });
  }

  const openCount       = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "inprogress").length;
  const highCount       = tickets.filter(t => t.priority === "high" || t.priority === "urgent").length;
  const resolvedCount   = tickets.filter(t => t.status === "resolved").length;

  const hasFilters = !!(params.searchTerm || params.status || params.priority || params.category);

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Phiếu hỗ trợ</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {ticketsData ? `${ticketsData.totalCount} phiếu tổng cộng` : "Đang tải…"}
          </p>
        </div>
      </div>

      {/* KPIs — từ trang hiện tại (không bị filter) */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Đang mở"      value={String(openCount)}       sub="Cần phản hồi ngay"    color="#2563EB" icon={LifeBuoy}      bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang xử lý"   value={String(inProgressCount)} sub="Đang được giải quyết" color="#f97316" icon={Clock}         bg="rgba(249,115,22,0.08)" />
        <AdminKPICard label="Ưu tiên cao"  value={String(highCount)}       sub="SLA < 4 giờ"          color="#dc2626" icon={AlertTriangle}  bg="rgba(220,38,38,0.08)" />
        <AdminKPICard label="Đã giải quyết" value={String(resolvedCount)}  sub="Trang hiện tại"       color="#16a34a" icon={CheckCircle2}  bg="rgba(22,163,74,0.08)" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 bg-white px-4 py-3 rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            ref={searchRef}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applySearch()}
            placeholder="Tìm theo ID phiếu, tenant hoặc tiêu đề…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>

        {/* Status */}
        <select
          value={params.status ?? ""}
          onChange={e => setFilter("status", e.target.value as TicketStatus | "")}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          <option value="">Tất cả trạng thái</option>
          {(["open", "inprogress", "resolved", "closed"] as TicketStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>

        {/* Priority */}
        <select
          value={params.priority ?? ""}
          onChange={e => setFilter("priority", e.target.value as TicketPriority | "")}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          <option value="">Tất cả ưu tiên</option>
          {(["high", "urgent", "medium", "low"] as TicketPriority[]).map(p => (
            <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
          ))}
        </select>

        {/* Category */}
        <select
          value={params.category ?? ""}
          onChange={e => setFilter("category", e.target.value)}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          <option value="">Tất cả danh mục</option>
          <option value="Technical">Kỹ thuật</option>
          <option value="Billing">Thanh toán</option>
          <option value="Account">Tài khoản</option>
          <option value="Feature">Tính năng</option>
          <option value="Other">Khác</option>
        </select>

        <button
          onClick={applySearch}
          className="px-3 py-2 rounded-xl"
          style={{ background: "#2563EB", color: "white", fontSize: "0.78rem", fontWeight: 600 }}
        >
          Tìm
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
            style={{ border: "1.5px solid rgba(220,38,38,0.2)", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}
          >
            <X className="w-3.5 h-3.5" /> Xóa lọc
          </button>
        )}
      </div>

      {/* Ticket list */}
      {isLoading ? (
        <AdminCard><SkeletonTable rows={6} /></AdminCard>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {tickets.map(ticket => {
              const pri = PRIORITY_STYLES[ticket.priority] ?? DEFAULT_PRIORITY_STYLE;
              const sts = STATUS_STYLES[ticket.status]   ?? DEFAULT_STATUS_STYLE;
              return (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedId(ticket.id)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white text-left w-full hover:shadow-md transition-all"
                  style={{
                    border: `1.5px solid ${(ticket.priority === "high" || ticket.priority === "urgent") && ticket.status === "open" ? "rgba(220,38,38,0.25)" : "rgba(0,0,0,0.06)"}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Priority bar */}
                  <div className="w-1.5 h-12 rounded-full flex-shrink-0" style={{ background: PRIORITY_BAR[ticket.priority] ?? "#9ca3af" }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563EB" }}>
                        #{ticket.ticketNumber || ticket.id.slice(0, 8)}
                      </span>
                      {/* Status badge — also benefits from optimistic update */}
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: sts.bg, border: `1px solid ${sts.border}`, fontSize: "0.6rem", fontWeight: 700, color: sts.text, transition: "all 0.15s" }}
                      >
                        {STATUS_LABEL[ticket.status]}
                      </span>
                      <span className="px-2 py-0.5 rounded-full" style={{ background: pri.bg, fontSize: "0.6rem", fontWeight: 700, color: pri.text }}>
                        {PRIORITY_LABEL[ticket.priority]}
                      </span>
                      {ticket.category && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.07)", fontSize: "0.6rem", fontWeight: 600, color: "#7c3aed" }}>
                          <Tag className="w-2.5 h-2.5" /> {ticket.category}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ticket.subject}
                    </p>
                    <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>
                      {ticket.tenantName && <>{ticket.tenantName} · </>}
                      {new Date(ticket.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  {ticket.assignedTo && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
                        <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "#2563EB" }}>
                          {ticket.assignedTo.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#d1d5db" }} />
                </button>
              );
            })}

            {tickets.length === 0 && (
              <div className="py-14 text-center bg-white rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
                <LifeBuoy className="w-8 h-8 mx-auto mb-3" style={{ color: "#d1d5db" }} />
                <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không có phiếu nào phù hợp với bộ lọc.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {(ticketsData?.totalCount ?? 0) > PAGE_SIZE && (
            <div className="flex items-center justify-between px-1">
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                Trang {ticketsData?.pageNumber} / {ticketsData?.totalPages} · {ticketsData?.totalCount} phiếu
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={!ticketsData?.hasPreviousPage}
                  onClick={() => setParams(p => ({ ...p, pageNumber: (p.pageNumber ?? 1) - 1 }))}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}
                >
                  ← Trước
                </button>
                <button
                  disabled={!ticketsData?.hasNextPage}
                  onClick={() => setParams(p => ({ ...p, pageNumber: (p.pageNumber ?? 1) + 1 }))}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  style={{ border: "1.5px solid rgba(0,0,0,0.08)", color: "#374151" }}
                >
                  Tiếp →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selectedId && (
        <TicketDetailModal ticketId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}

export default function AdminSupportPage() {
  return (
    <AdminErrorBoundary>
      <AdminPageShell title="Hỗ trợ" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Hỗ trợ" }]}>
        <SupportContent />
      </AdminPageShell>
    </AdminErrorBoundary>
  );
}
