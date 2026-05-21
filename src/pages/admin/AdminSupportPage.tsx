import { useState } from "react";
import {
  LifeBuoy, AlertTriangle, Clock, CheckCircle2, X,
  Search, MessageCircle, User, ChevronRight, Send,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminStatusBadge, SkeletonTable } from "@/components/admin/AdminWidgets";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";
import { useSupportTickets, useTicketDetail, useUpdateTicket, useReplyTicket } from "@/hooks/admin/useSupport";
import type { SupportTicket, TicketStatus, TicketPriority } from "@/types/admin";
import "@/styles/fonts.css";

const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  Open:       'Đang mở',
  InProgress: 'Đang xử lý',
  Resolved:   'Đã giải quyết',
  Closed:     'Đã đóng',
};

const TICKET_STATUS_TYPE: Record<TicketStatus, 'info' | 'warning' | 'success' | 'neutral'> = {
  Open:       'info',
  InProgress: 'warning',
  Resolved:   'success',
  Closed:     'neutral',
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  High:   'Cao',
  Medium: 'Trung bình',
  Low:    'Thấp',
};

const PRIORITY_STYLES: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  High:   { bg: "rgba(220,38,38,0.08)",   text: "#dc2626", border: "rgba(220,38,38,0.2)"  },
  Medium: { bg: "rgba(249,115,22,0.08)",  text: "#ea580c", border: "rgba(249,115,22,0.2)" },
  Low:    { bg: "rgba(107,114,128,0.08)", text: "#6b7280", border: "rgba(107,114,128,0.2)"},
};

const PRIORITY_BAR_COLOR: Record<TicketPriority, string> = {
  High:   "#dc2626",
  Medium: "#f97316",
  Low:    "#9ca3af",
};

function TicketDetailModal({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const [reply, setReply] = useState("");
  const [pendingStatus, setPendingStatus] = useState<TicketStatus | "">("");

  const { data: ticket, isLoading } = useTicketDetail(ticketId);
  const updateMutation = useUpdateTicket();
  const replyMutation = useReplyTicket();

  function handleStatusChange(status: TicketStatus) {
    setPendingStatus(status);
    updateMutation.mutate({ id: ticketId, data: { status } }, {
      onSettled: () => setPendingStatus(""),
    });
  }

  function handleSend() {
    if (!reply.trim()) return;
    replyMutation.mutate({ id: ticketId, data: { content: reply } }, {
      onSuccess: () => setReply(""),
    });
  }

  if (!ticket && !isLoading) return null;

  const p = ticket ? PRIORITY_STYLES[ticket.priority] : PRIORITY_STYLES.Low;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white overflow-hidden flex flex-col"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          {isLoading || !ticket ? (
            <div className="h-20 animate-pulse bg-gray-100 rounded-xl" />
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#2563EB" }}>#{ticket.id}</span>
                    <AdminStatusBadge status={TICKET_STATUS_LABEL[ticket.status]} type={TICKET_STATUS_TYPE[ticket.status]} />
                    <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, border: `1px solid ${p.border}`, fontSize: "0.62rem", fontWeight: 700, color: p.text }}>
                      Ưu tiên {PRIORITY_LABEL[ticket.priority]}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "0.98rem", fontWeight: 800, color: "#111827" }}>{ticket.subject}</h2>
                  <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "3px" }}>
                    {ticket.tenantName} · Mở lúc {new Date(ticket.openedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
                  <X className="w-4 h-4" style={{ color: "#6b7280" }} />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {ticket.assigneeName && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#2563EB" }}>Phân công: {ticket.assigneeName}</span>
                  </div>
                )}
                {ticket.status !== "Resolved" && ticket.status !== "Closed" && (
                  <select
                    value={pendingStatus || ticket.status}
                    onChange={e => handleStatusChange(e.target.value as TicketStatus)}
                    disabled={updateMutation.isPending}
                    className="px-3 py-1.5 rounded-xl outline-none cursor-pointer"
                    style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.12)", fontSize: "0.68rem", fontWeight: 600, color: "#16a34a" }}
                  >
                    {(["Open", "InProgress", "Resolved", "Closed"] as TicketStatus[]).map(s => (
                      <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-2xl" />)}
            </div>
          ) : (ticket?.messages ?? []).map((m, i) => (
            <div key={i} className={`flex items-start gap-3 ${m.senderRole === "Admin" ? "flex-row-reverse" : ""}`}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: m.senderRole === "Admin"
                    ? "linear-gradient(135deg,#2563EB,#7c3aed)"
                    : m.senderRole === "System"
                    ? "rgba(107,114,128,0.1)"
                    : "rgba(249,115,22,0.1)",
                }}
              >
                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: m.senderRole === "Admin" ? "white" : m.senderRole === "System" ? "#9ca3af" : "#ea580c" }}>
                  {m.senderName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className={`flex flex-col gap-1 max-w-xs ${m.senderRole === "Admin" ? "items-end" : ""}`}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151" }}>{m.senderName}</span>
                  <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{new Date(m.sentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div
                  className="px-4 py-2.5 rounded-2xl"
                  style={{
                    background: m.senderRole === "Admin"
                      ? "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.06))"
                      : m.senderRole === "System"
                      ? "rgba(107,114,128,0.06)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${m.senderRole === "Admin" ? "rgba(37,99,235,0.15)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.5 }}>{m.content}</p>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && (ticket?.messages ?? []).length === 0 && (
            <p className="text-center py-6" style={{ fontSize: "0.8rem", color: "#9ca3af" }}>Chưa có tin nhắn nào.</p>
          )}
        </div>

        {/* Reply */}
        <div className="px-6 pb-5 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex gap-2.5">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Nhập phản hồi…"
              className="flex-1 px-4 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151", background: "#fafafa" }}
            />
            <button
              onClick={handleSend}
              disabled={!reply.trim() || replyMutation.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
              style={{ background: reply.trim() ? "linear-gradient(135deg,#2563EB,#1d4ed8)" : "#e5e7eb", color: reply.trim() ? "white" : "#9ca3af", fontWeight: 700, fontSize: "0.8rem" }}
            >
              <Send className="w-3.5 h-3.5" /> Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportContent() {
  const [search, setSearch]      = useState("");
  const [filterStatus, setStatus] = useState<TicketStatus | "">("");
  const [filterPriority, setPri]  = useState<TicketPriority | "">("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: tickets = [], isLoading } = useSupportTickets({
    status:   filterStatus || undefined,
    priority: filterPriority || undefined,
  });

  const filtered = tickets.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.subject.toLowerCase().includes(q) || t.tenantName.toLowerCase().includes(q) || t.id.includes(q);
  });

  const openCount       = tickets.filter(t => t.status === "Open").length;
  const inProgressCount = tickets.filter(t => t.status === "InProgress").length;
  const highCount       = tickets.filter(t => t.priority === "High").length;
  const resolvedCount   = tickets.filter(t => t.status === "Resolved").length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Phiếu hỗ trợ</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {tickets.filter(t => t.status !== "Closed").length} phiếu đang hoạt động
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Đang mở"     value={String(openCount)}       sub="Cần phản hồi ngay"      color="#2563EB" icon={LifeBuoy}     bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang xử lý"  value={String(inProgressCount)} sub="Đang được giải quyết"   color="#f97316" icon={Clock}        bg="rgba(249,115,22,0.08)" />
        <AdminKPICard label="Ưu tiên cao" value={String(highCount)}        sub="SLA < 4 giờ"            color="#dc2626" icon={AlertTriangle} bg="rgba(220,38,38,0.08)" />
        <AdminKPICard label="Đã giải quyết" value={String(resolvedCount)} sub="Trong 24 giờ qua"        color="#16a34a" icon={CheckCircle2} bg="rgba(22,163,74,0.08)" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo ID phiếu, tenant hoặc tiêu đề…"
            className="w-full pl-9 pr-4 py-2 rounded-xl outline-none"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.82rem", color: "#111827" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setStatus(e.target.value as TicketStatus | "")}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          <option value="">Tất cả trạng thái</option>
          {(["Open", "InProgress", "Resolved", "Closed"] as TicketStatus[]).map(s => (
            <option key={s} value={s}>{TICKET_STATUS_LABEL[s]}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={e => setPri(e.target.value as TicketPriority | "")}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          <option value="">Tất cả ưu tiên</option>
          {(["High", "Medium", "Low"] as TicketPriority[]).map(p => (
            <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
          ))}
        </select>
      </div>

      {/* Ticket list */}
      {isLoading ? (
        <AdminCard><SkeletonTable rows={6} /></AdminCard>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map(ticket => {
            const p = PRIORITY_STYLES[ticket.priority];
            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedId(ticket.id)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white text-left w-full hover:shadow-md transition-all"
                style={{
                  border: `1.5px solid ${ticket.priority === "High" && ticket.status === "Open" ? "rgba(220,38,38,0.25)" : "rgba(0,0,0,0.06)"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  className="w-2 h-12 rounded-full flex-shrink-0"
                  style={{ background: PRIORITY_BAR_COLOR[ticket.priority] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563EB" }}>#{ticket.id}</span>
                    <AdminStatusBadge status={TICKET_STATUS_LABEL[ticket.status]} type={TICKET_STATUS_TYPE[ticket.status]} />
                    <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, fontSize: "0.6rem", fontWeight: 700, color: p.text }}>
                      {PRIORITY_LABEL[ticket.priority]}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{ticket.subject}</p>
                  <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>
                    {ticket.tenantName} · {new Date(ticket.openedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {ticket.assigneeName && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
                        <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "#2563EB" }}>
                          {ticket.assigneeName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af" }}>{ticket.assigneeName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" style={{ color: "#9ca3af" }} />
                    <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{ticket.messageCount} tin nhắn</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#d1d5db" }} />
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center bg-white rounded-2xl" style={{ border: "1.5px solid rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không có phiếu nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </div>
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
