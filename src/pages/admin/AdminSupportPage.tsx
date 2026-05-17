import { useState } from "react";
import {
  LifeBuoy, AlertTriangle, Clock, CheckCircle2, X,
  Search, MessageCircle, User, ChevronRight, Send,
} from "lucide-react";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminKPICard, AdminCard, AdminCardHeader, AdminStatusBadge } from "@/components/admin/AdminWidgets";
import "@/styles/fonts.css";

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Cao":       { bg: "rgba(220,38,38,0.08)",  text: "#dc2626", border: "rgba(220,38,38,0.2)"  },
  "Trung bình":{ bg: "rgba(249,115,22,0.08)", text: "#ea580c", border: "rgba(249,115,22,0.2)" },
  "Thấp":      { bg: "rgba(107,114,128,0.08)",text: "#6b7280", border: "rgba(107,114,128,0.2)"},
};

const TICKETS = [
  { id: "#1042", tenant: "Vet Harmony Clinic",    subject: "Sự cố kết nối API — dịch vụ đặt lịch bị gián đoạn",       priority: "Cao",       status: "Đang mở",      opened: "6/3/2026 · 9:14 SA",   assignee: "Sarah Chen",  messages: 3  },
  { id: "#1041", tenant: "Paws & Claws Clinic",   subject: "Lỗi cổng thanh toán khi thanh toán trên POS",              priority: "Cao",       status: "Đang xử lý",   opened: "5/3/2026 · 4:30 CH",   assignee: "Mike Torres", messages: 7  },
  { id: "#1040", tenant: "Happy Tails Hospital",  subject: "Không thể nhập hồ sơ bệnh nhân từ phần mềm cũ",           priority: "Trung bình",status: "Đang mở",      opened: "5/3/2026 · 2:15 CH",   assignee: "Chưa phân công", messages: 1 },
  { id: "#1041", tenant: "Gentle Paws Vet",       subject: "Tin nhắn nhắc lịch qua SMS không được gửi",               priority: "Trung bình",status: "Đang xử lý",   opened: "4/3/2026 · 11:00 SA",  assignee: "Sarah Chen",  messages: 5  },
  { id: "#1038", tenant: "PetHealth Partners",    subject: "Xuất báo cáo tạo ra khoảng thời gian không chính xác",    priority: "Thấp",      status: "Đang xử lý",   opened: "3/3/2026 · 3:45 CH",   assignee: "Mike Torres", messages: 4  },
  { id: "#1037", tenant: "Urban Animal Clinic",   subject: "Tính năng tự trừ kho hàng không đồng bộ đúng",           priority: "Trung bình",status: "Đã giải quyết",opened: "2/3/2026 · 10:30 SA",  assignee: "Sarah Chen",  messages: 9  },
  { id: "#1036", tenant: "All Creatures Vet",     subject: "Dashboard tải chậm (>10 giây)",                           priority: "Thấp",      status: "Đã giải quyết",opened: "1/3/2026 · 8:00 SA",   assignee: "Mike Torres", messages: 6  },
  { id: "#1035", tenant: "Clearview Vet Group",   subject: "Yêu cầu tính năng đa chi nhánh — nâng cấp ưu tiên",     priority: "Thấp",      status: "Đã đóng",      opened: "28/2/2026 · 2:00 CH",  assignee: "Sarah Chen",  messages: 12 },
];

const CONVERSATION = [
  { from: "tenant", name: "BS. Lisa Wong", avatar: "LW", time: "9:14 SA", msg: "API đặt lịch của chúng tôi đang trả về lỗi 503 từ 8:45 SA. Toàn bộ hoạt động phòng khám bị gián đoạn. Đây là tình huống khẩn cấp." },
  { from: "admin",  name: "Sarah Chen",    avatar: "SC", time: "9:22 SA", msg: "Chào BS. Wong, tôi đã leo thang sự cố này ngay lập tức đến đội kỹ thuật. Chúng tôi đang điều tra — tôi sẽ cập nhật cho bạn mỗi 15 phút." },
  { from: "tenant", name: "BS. Lisa Wong", avatar: "LW", time: "9:35 SA", msg: "Vẫn còn lỗi. Chúng tôi có 14 bệnh nhân đặt lịch sáng nay mà không thể check-in." },
  { from: "system", name: "Hệ thống",      avatar: "HT", time: "9:40 SA", msg: "Đội kỹ thuật đã xác định cấu hình sai load balancer được triển khai trong cửa sổ bảo trì 8:40 SA. Đang tiến hành rollback." },
];

type Ticket = typeof TICKETS[0];

function TicketDetail({ ticket, onClose, role }: { ticket: Ticket; onClose: () => void; role: string }) {
  const [reply, setReply] = useState("");
  const p = PRIORITY_STYLES[ticket.priority];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white overflow-hidden flex flex-col" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#2563EB" }}>{ticket.id}</span>
                <AdminStatusBadge 
                  status={ticket.status} 
                  type={ticket.status === "Đã giải quyết" ? "success" : ticket.status === "Đang mở" ? "info" : ticket.status === "Đang xử lý" ? "warning" : "neutral"} 
                />
                <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, border: `1px solid ${p.border}`, fontSize: "0.62rem", fontWeight: 700, color: p.text }}>
                  Ưu tiên {ticket.priority}
                </span>
              </div>
              <h2 style={{ fontSize: "0.98rem", fontWeight: 800, color: "#111827" }}>{ticket.subject}</h2>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "3px" }}>{ticket.tenant} · Mở lúc {ticket.opened}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 flex-shrink-0">
              <X className="w-4 h-4" style={{ color: "#6b7280" }} />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.12)" }}>
              <User className="w-3.5 h-3.5" style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#2563EB" }}>Phân công: {ticket.assignee}</span>
            </div>
            {role === "admin" && ticket.status !== "Đã giải quyết" && ticket.status !== "Đã đóng" && (
              <>
                <select className="px-3 py-1.5 rounded-xl outline-none cursor-pointer" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.12)", fontSize: "0.68rem", fontWeight: 600, color: "#16a34a" }}>
                  {["Đang mở", "Đang xử lý", "Đã giải quyết", "Đã đóng"].map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)", fontSize: "0.68rem", fontWeight: 700, color: "#dc2626" }}>
                  Leo thang
                </button>
              </>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {CONVERSATION.map((m, i) => (
            <div key={i} className={`flex items-start gap-3 ${m.from === "admin" ? "flex-row-reverse" : ""}`}>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: m.from === "admin"
                    ? "linear-gradient(135deg,#2563EB,#7c3aed)"
                    : m.from === "system"
                    ? "rgba(107,114,128,0.1)"
                    : "rgba(249,115,22,0.1)",
                }}
              >
                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: m.from === "admin" ? "white" : m.from === "system" ? "#9ca3af" : "#ea580c" }}>
                  {m.avatar}
                </span>
              </div>
              <div className={`flex flex-col gap-1 max-w-xs ${m.from === "admin" ? "items-end" : ""}`}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#374151" }}>{m.name}</span>
                  <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{m.time}</span>
                </div>
                <div
                  className="px-4 py-2.5 rounded-2xl"
                  style={{
                    background: m.from === "admin"
                      ? "linear-gradient(135deg,rgba(37,99,235,0.1),rgba(37,99,235,0.06))"
                      : m.from === "system"
                      ? "rgba(107,114,128,0.06)"
                      : "rgba(0,0,0,0.04)",
                    border: `1px solid ${m.from === "admin" ? "rgba(37,99,235,0.15)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <p style={{ fontSize: "0.78rem", color: "#374151", lineHeight: 1.5 }}>{m.msg}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div className="px-6 pb-5 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex gap-2.5">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Nhập phản hồi…"
              className="flex-1 px-4 py-2.5 rounded-xl outline-none"
              style={{ border: "1.5px solid rgba(0,0,0,0.1)", fontSize: "0.82rem", color: "#374151", background: "#fafafa" }}
            />
            <button
              disabled={!reply.trim()}
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

export default function AdminSupportPage() {
  const [search, setSearch]           = useState("");
  const [filterStatus, setStatus]     = useState("Tất cả");
  const [filterPriority, setPri]      = useState("Tất cả");
  const [selected, setSelected]       = useState<Ticket | null>(null);
  
  const pageRole = (sessionStorage.getItem("adminRole") as "admin" | "staff") || "admin";

  const filtered = TICKETS.filter(t => {
    const ms  = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.tenant.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const mst = filterStatus === "Tất cả" || t.status === filterStatus;
    const mp  = filterPriority === "Tất cả" || t.priority === filterPriority;
    return ms && mst && mp;
  });

  return (
    <AdminPageShell title="Hỗ trợ" breadcrumbs={[{ label: "Cổng quản trị", href: "/admin" }, { label: "Hỗ trợ" }]}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.025em" }}>Phiếu hỗ trợ</h2>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: "2px" }}>
            {TICKETS.filter(t => t.status !== "Đã đóng").length} phiếu đang hoạt động · Phản hồi TB 18 phút
          </p>
        </div>
        {pageRole === "admin" && (
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
            + Phiếu mới
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <AdminKPICard label="Đang mở" value={TICKETS.filter(t => t.status === "Đang mở").length.toString()} sub="Cần phản hồi ngay" color="#2563EB" icon={LifeBuoy} bg="rgba(37,99,235,0.08)" />
        <AdminKPICard label="Đang xử lý" value={TICKETS.filter(t => t.status === "Đang xử lý").length.toString()} sub="Đang được giải quyết" color="#f97316" icon={Clock} bg="rgba(249,115,22,0.08)" />
        <AdminKPICard label="Ưu tiên cao" value={TICKETS.filter(t => t.priority === "Cao").length.toString()} sub="SLA < 4 giờ" color="#dc2626" icon={AlertTriangle} bg="rgba(220,38,38,0.08)" />
        <AdminKPICard label="Đã giải quyết" value={TICKETS.filter(t => t.status === "Đã giải quyết").length.toString()} sub="Trong 24 giờ qua" color="#16a34a" icon={CheckCircle2} bg="rgba(22,163,74,0.08)" />
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
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          {["Tất cả", "Đang mở", "Đang xử lý", "Đã giải quyết", "Đã đóng"].map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={e => setPri(e.target.value)}
          className="px-3 py-2 rounded-xl outline-none cursor-pointer"
          style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#374151" }}
        >
          {["Tất cả", "Cao", "Trung bình", "Thấp"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>

      {/* Ticket list */}
      <div className="flex flex-col gap-2.5">
        {filtered.map(ticket => {
          const p = PRIORITY_STYLES[ticket.priority];
          return (
            <button
              key={ticket.id}
              onClick={() => setSelected(ticket)}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white text-left w-full hover:shadow-md transition-all"
              style={{
                border: `1.5px solid ${ticket.priority === "Cao" && ticket.status === "Đang mở" ? "rgba(220,38,38,0.25)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div
                className="w-2 h-12 rounded-full flex-shrink-0"
                style={{ background: ticket.priority === "Cao" ? "#dc2626" : ticket.priority === "Trung bình" ? "#f97316" : "#9ca3af" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563EB" }}>{ticket.id}</span>
                  <AdminStatusBadge 
                    status={ticket.status} 
                    type={ticket.status === "Đã giải quyết" ? "success" : ticket.status === "Đang mở" ? "info" : ticket.status === "Đang xử lý" ? "warning" : "neutral"} 
                  />
                  <span className="px-2 py-0.5 rounded-full" style={{ background: p.bg, fontSize: "0.6rem", fontWeight: 700, color: p.text }}>
                    {ticket.priority}
                  </span>
                </div>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{ticket.subject}</p>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>{ticket.tenant} · {ticket.opened}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(37,99,235,0.1)" }}>
                    <span style={{ fontSize: "0.55rem", fontWeight: 800, color: "#2563EB" }}>
                      {ticket.assignee === "Chưa phân công" ? "?" : ticket.assignee.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "#9ca3af" }}>{ticket.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" style={{ color: "#9ca3af" }} />
                  <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{ticket.messages} tin nhắn</span>
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

      {selected && (
        <TicketDetail
          ticket={selected}
          onClose={() => setSelected(null)}
          role={pageRole}
        />
      )}
    </AdminPageShell>
  );
}
