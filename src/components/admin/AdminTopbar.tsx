import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell, Search, X, ChevronRight, AlertCircle,
  CheckCircle2, Zap, Users, Settings,
  ShieldCheck, LogOut, ChevronDown, PawPrint,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

const NOTIFS = [
  { id: "n1", type: "alert",   title: "Tenant 'Paws & Claws' thanh toán thất bại",   body: "Hóa đơn #INV-2026-091 · $149 quá hạn",               time: "3 phút trước",  read: false, color: "#dc2626" },
  { id: "n2", type: "signup",  title: "Tenant mới đăng ký: Happy Tails Clinic",        body: "Gói Starter · Bắt đầu dùng thử hôm nay",             time: "21 phút trước", read: false, color: "#2563EB" },
  { id: "n3", type: "upgrade", title: "Furever Care nâng cấp lên Enterprise",           body: "Growth → Enterprise · +$350/tháng MRR",              time: "1 giờ trước",   read: false, color: "#16a34a" },
  { id: "n4", type: "ticket",  title: "Phiếu ưu tiên cao #1042 được mở",               body: "Báo cáo sự cố API từ Vet Harmony Clinic",             time: "2 giờ trước",  read: true,  color: "#f97316" },
  { id: "n5", type: "system",  title: "Cửa sổ bảo trì đã lên lịch",                   body: "Di chuyển DB đêm nay 11 SA – 12 SA UTC",             time: "Hôm qua",  read: true,  color: "#9ca3af" },
];

const SEARCH_INDEX = [
  { type: "tenant",  label: "Paws & Claws Clinic",       sub: "Hoạt động · Gói Growth · ID: T-00142",   href: "/admin/tenants" },
  { type: "tenant",  label: "Happy Tails Animal Hospital",sub: "Dùng thử · Gói Starter · ID: T-00198",   href: "/admin/tenants" },
  { type: "billing", label: "INV-2026-091 · $149.00",    sub: "Quá hạn · Paws & Claws · 1/3/2026",      href: "/admin/billing" },
  { type: "ticket",  label: "Ticket #1042 — API Outage", sub: "Ưu tiên cao · Mở · Vet Harmony",          href: "/admin/support" },
  { type: "user",    label: "Sarah Chen — Nhân viên hỗ trợ", sub: "Hoạt động · Đăng nhập lần cuối 2 giờ trước",href: "/admin/users" },
];

function NotifPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-[200]" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 flex flex-col" style={{ width: "360px", background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.13)", borderLeft: "1px solid rgba(0,0,0,0.07)", fontFamily: "Inter, sans-serif" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>Thông báo quản trị</h2>
            {unread > 0 && <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "2px" }}>{unread} chưa đọc</p>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && <button onClick={() => setNotifs(p => p.map(n => ({ ...n, read: true })))} style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2563EB" }}>Đánh dấu tất cả đã đọc</button>}
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="w-3.5 h-3.5" style={{ color: "#6b7280" }} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifs.map(n => (
            <button key={n.id} onClick={() => setNotifs(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className="flex items-start gap-3 w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: !n.read ? `${n.color}05` : "white" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${n.color}14` }}>
                {n.type === "alert"   ? <AlertCircle  className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "signup"  ? <Users        className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "upgrade" ? <Zap          className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "ticket"  ? <CheckCircle2 className="w-4 h-4" style={{ color: n.color }} /> :
                                        <Settings     className="w-4 h-4" style={{ color: n.color }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p style={{ fontSize: "0.78rem", fontWeight: !n.read ? 700 : 500, color: "#111827", lineHeight: 1.35 }}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />}
                </div>
                <p style={{ fontSize: "0.66rem", color: "#9ca3af", marginTop: "2px", lineHeight: 1.4 }}>{n.body}</p>
                <p style={{ fontSize: "0.6rem", color: "#d1d5db", marginTop: "3px" }}>{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const results = query.length > 1 ? SEARCH_INDEX.filter(r =>
    r.label.toLowerCase().includes(query.toLowerCase()) ||
    r.sub.toLowerCase().includes(query.toLowerCase())) : [];

  const typeLabel: Record<string, string> = { tenant: "Tenant", billing: "Thanh toán", ticket: "Ticket", user: "Người dùng" };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center pt-16 px-6" style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="w-full max-w-xl rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: query.length > 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#9ca3af" }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm kiếm tenants, tickets, hóa đơn, người dùng…" className="flex-1 outline-none bg-transparent" style={{ fontSize: "0.92rem", color: "#111827", fontFamily: "Inter, sans-serif" }} />
          {query && <button onClick={() => setQuery("")}><X className="w-4 h-4" style={{ color: "#9ca3af" }} /></button>}
          <button onClick={onClose} className="px-2 py-1 rounded-lg" style={{ background: "#e5e7eb", fontSize: "0.6rem", fontWeight: 700, color: "#6b7280", fontFamily: "monospace" }}>ESC</button>
        </div>
        {query.length > 1 ? (
          results.length > 0 ? (
            <div className="py-2 max-h-80 overflow-y-auto">
              {results.map((r, i) => (
                <button key={i} onClick={() => { navigate(r.href); onClose(); }}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-blue-50 transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(37,99,235,0.07)" }}>
                    <PawPrint className="w-4 h-4" style={{ color: "#2563EB" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "0.83rem", fontWeight: 600, color: "#111827" }}>{r.label}</p>
                    <p style={{ fontSize: "0.66rem", color: "#9ca3af" }}>{r.sub}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md" style={{ background: "#f3f4f6", fontSize: "0.58rem", fontWeight: 700, color: "#9ca3af" }}>{typeLabel[r.type]}</span>
                  <ChevronRight className="w-4 h-4" style={{ color: "#d1d5db" }} />
                </button>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>Không có kết quả cho "<strong style={{ color: "#374151" }}>{query}</strong>"</p>
            </div>
          )
        ) : (
          <div className="px-5 py-4">
            <p style={{ fontSize: "0.62rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "8px" }}>LIÊN KẾT NHANH</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Paws & Claws", "INV-2026-091", "Ticket #1042", "Happy Tails"].map(q => (
                <button key={q} onClick={() => setQuery(q)} className="px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors" style={{ background: "#f4f6fb", fontSize: "0.72rem", fontWeight: 600, color: "#374151", border: "1px solid #e5e7eb" }}>{q}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarMenu({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === Role.SuperAdmin;

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50" style={{ background: "white", border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 12px 40px rgba(0,0,0,0.13)", width: "220px", fontFamily: "Inter, sans-serif" }}>
      <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.03))" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "SA"}</span>
          </div>
          <div>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{isAdmin ? "System Admin" : "Nhân viên hỗ trợ"}</p>
            <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{user?.email || "admin@pettech.io"}</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        {isAdmin && (
          <button onClick={() => { navigate("/admin/system"); onClose(); }} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
            <Settings className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            <span style={{ fontSize: "0.8rem", color: "#374151" }}>Cài đặt hệ thống</span>
          </button>
        )}
        <button onClick={() => { navigate("/admin/users"); onClose(); }} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
          <span style={{ fontSize: "0.8rem", color: "#374151" }}>Người dùng quản trị</span>
        </button>
      </div>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <button onClick={() => { logout(); navigate("/"); onClose(); }} className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
          <LogOut className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 700 }}>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

interface AdminTopbarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminTopbar({ title, breadcrumbs = [] }: AdminTopbarProps) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const unread = NOTIFS.filter(n => !n.read).length;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(true); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-7 py-4 bg-white border-b flex-shrink-0" style={{ borderColor: "rgba(0,0,0,0.07)", height: "65px", fontFamily: "Inter, sans-serif" }}>
        <div className="flex flex-col justify-center">
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 mb-0.5">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  {crumb.href
                    ? <Link to={crumb.href} className="hover:text-blue-600 transition-colors" style={{ fontSize: "0.7rem", fontWeight: 500, color: "#9ca3af", textDecoration: "none" }}>{crumb.label}</Link>
                    : <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#9ca3af" }}>{crumb.label}</span>}
                  {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" style={{ color: "#d1d5db" }} />}
                </span>
              ))}
            </nav>
          )}
          <h1 style={{ fontSize: "1.12rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Portal label */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.15)" }}>
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#7c3aed" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#7c3aed", letterSpacing: "0.06em" }}>CỔNG QUẢN TRỊ</span>
          </div>

          {/* Search */}
          <button onClick={() => setShowSearch(true)} className="relative hidden md:flex items-center gap-2.5 pl-9 pr-4 py-2 rounded-xl hover:border-blue-300 transition-colors" style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", color: "#9ca3af", width: "200px" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
            Tìm kiếm…
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded" style={{ background: "#e5e7eb", fontSize: "0.58rem", fontWeight: 600, color: "#9ca3af", fontFamily: "monospace" }}>⌘K</kbd>
          </button>

          {/* Notifications */}
          <button onClick={() => setShowNotifs(true)} className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors" style={{ border: "1.5px solid rgba(0,0,0,0.08)" }}>
            <Bell className="w-4 h-4 text-gray-500" />
            {unread > 0 && <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center px-1" style={{ background: "#dc2626", border: "1.5px solid white", fontSize: "0.5rem", fontWeight: 900, color: "white" }}>{unread}</span>}
          </button>

          {/* Avatar */}
          <div className="relative">
            <button onClick={() => setShowAvatar(v => !v)} className="flex items-center gap-1.5 px-1.5 py-1 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "SA"}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            </button>
            {showAvatar && <AvatarMenu onClose={() => setShowAvatar(false)} />}
          </div>
        </div>
      </header>

      {showNotifs && <NotifPanel onClose={() => setShowNotifs(false)} />}
      {showSearch  && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
