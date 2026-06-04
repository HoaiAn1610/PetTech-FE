import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell, Search, ChevronRight, ExternalLink, X,
  CalendarDays, AlertCircle, Gift, Activity,
  Settings, User, LogOut, HelpCircle, ChevronDown,
  PawPrint, FileText, Users, Package, Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

const NOTIF_DATA = [
  { id: "n1", type: "appt",    title: "Đặt lịch mới từ Maria Santos",           body: "Tắm chải · 13/4 lúc 14:30 · Bella",             time: "2 phút trước",   read: false, color: "#2563EB" },
  { id: "n2", type: "alert",   title: "3 lần không đến hôm nay",                body: "Đã gửi SMS nhắc nhở tự động cho cả 3 khách",   time: "18 phút trước",  read: false, color: "#F97316" },
  { id: "n3", type: "health",  title: "Gửi nhắc nhở vaccine hàng loạt xong",    body: "218 email đã gửi · Tỷ lệ mở 79%",             time: "1 giờ trước",    read: false, color: "#16a34a" },
  { id: "n4", type: "reward",  title: "Doanh thu tháng đạt mốc mới 🎉",         body: "Phòng khám đạt $3,000 hôm nay — kỷ lục tháng!", time: "2 giờ trước",  read: true,  color: "#7c3aed" },
  { id: "n5", type: "system",  title: "Cập nhật hệ thống được lên lịch",        body: "PetTech v3.4.1 — tối nay lúc 23:00 UTC",       time: "Hôm qua",        read: true,  color: "#9ca3af" },
];

const SEARCH_INDEX = [
  { type: "patient",  label: "Bella (Golden Retriever)",        sub: "Chủ nuôi: Maria Santos · Khám lần cuối 7/3",  href: "/clinic/medical-records", icon: PawPrint },
  { type: "patient",  label: "Mochi (Mèo vàng)",                sub: "Chủ nuôi: James Lee · Đến hạn tiêm vaccine",  href: "/clinic/medical-records", icon: PawPrint },
  { type: "booking",  label: "Lịch hẹn #4821 — Tắm chải toàn bộ", sub: "12/4 · 10:30 SA · Jamie Reyes",             href: "/clinic/appointments", icon: CalendarDays },
  { type: "booking",  label: "Lịch hẹn #4805 — Khám tổng quát", sub: "10/4 · 15:00 · BS. Ana Torres",               href: "/clinic/appointments", icon: CalendarDays },
  { type: "invoice",  label: "INV-2026-034 · $149.00",          sub: "Gói Growth · 4/3/2026 · Đã thanh toán",       href: "/clinic/billing",      icon: FileText },
  { type: "staff",    label: "Jamie Reyes — Nhân viên tắm chải", sub: "Đang hoạt động · 4.9★ · 48 lịch hẹn tháng này", href: "/clinic/crm", icon: Users },
  { type: "inventory",label: "Apoquel 16mg (Oclacitinib)",      sub: "Tồn kho: 42 đơn vị · Ngưỡng thấp: 20",       href: "/clinic/inventory", icon: Package },
];

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-[200]" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 flex flex-col"
        style={{ width: "380px", background: "white", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", borderLeft: "1px solid rgba(0,0,0,0.07)", fontFamily: "Inter, sans-serif" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Thông báo</h2>
            {unread > 0 && <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>{unread} chưa đọc</p>}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563EB" }}>
                Đánh dấu tất cả đã đọc
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4" style={{ color: "#6b7280" }} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {notifs.map(n => (
            <button key={n.id}
              onClick={() => setNotifs(prev => prev.map(p => p.id === n.id ? { ...p, read: true } : p))}
              className="flex items-start gap-3 w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: !n.read ? `${n.color}04` : "white" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${n.color}14` }}>
                {n.type === "appt"    ? <CalendarDays className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "alert"   ? <AlertCircle  className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "health"  ? <Activity     className="w-4 h-4" style={{ color: n.color }} /> :
                 n.type === "reward"  ? <Gift         className="w-4 h-4" style={{ color: n.color }} /> :
                                        <Settings     className="w-4 h-4" style={{ color: n.color }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p style={{ fontSize: "0.8rem", fontWeight: !n.read ? 700 : 500, color: "#111827", lineHeight: 1.35 }}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: n.color }} />}
                </div>
                <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "3px", lineHeight: 1.4 }}>{n.body}</p>
                <p style={{ fontSize: "0.62rem", color: "#d1d5db", marginTop: "4px" }}>{n.time}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="px-6 py-4 border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <button className="w-full py-2.5 rounded-xl text-center transition-colors hover:bg-blue-50"
            style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", border: "1px solid rgba(37,99,235,0.2)" }}>
            Xem tất cả thông báo
          </button>
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
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = query.length > 1
    ? SEARCH_INDEX.filter(r =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.sub.toLowerCase().includes(query.toLowerCase()))
    : [];

  const typeLabels: Record<string, string> = {
    patient: "Bệnh nhân", booking: "Lịch hẹn", invoice: "Hoá đơn", staff: "Nhân viên", inventory: "Kho hàng",
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center pt-16 px-6"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: query.length > 1 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Tìm kiếm bất cứ thứ gì…"
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: "0.95rem", color: "#111827", fontFamily: "Inter, sans-serif" }} />
          {query && <button onClick={() => setQuery("")}><X className="w-4 h-4" style={{ color: "#9ca3af" }} /></button>}
          <button onClick={onClose} className="px-2 py-1 rounded-lg"
            style={{ background: "#e5e7eb", fontSize: "0.62rem", fontWeight: 700, color: "#6b7280", fontFamily: "monospace" }}>ESC</button>
        </div>
        {query.length > 1 ? (
          results.length > 0 ? (
            <div className="py-2 max-h-96 overflow-y-auto">
              {results.map((r, i) => {
                const Icon = r.icon;
                return (
                  <button key={i}
                    onClick={() => { navigate(r.href); onClose(); }}
                    className="flex items-center gap-3 w-full px-5 py-3 hover:bg-blue-50 transition-colors text-left">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(37,99,235,0.07)" }}>
                      <Icon className="w-4 h-4" style={{ color: "#2563EB" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}>{r.label}</p>
                      <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{r.sub}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md flex-shrink-0"
                      style={{ background: "#f3f4f6", fontSize: "0.6rem", fontWeight: 700, color: "#9ca3af" }}>
                      {typeLabels[r.type] ?? r.type}
                    </span>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#d1d5db" }} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p style={{ fontSize: "0.88rem", color: "#9ca3af" }}>Không tìm thấy kết quả cho "<strong style={{ color: "#374151" }}>{query}</strong>"</p>
            </div>
          )
        ) : (
          <div className="px-5 py-4">
            <p style={{ fontSize: "0.65rem", fontWeight: 800, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "10px" }}>TRUY CẬP NHANH</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Bella", "Lịch hẹn hôm nay", "INV-2026-034", "Jamie Reyes", "Apoquel"].map(q => (
                <button key={q} onClick={() => setQuery(q)}
                  className="px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  style={{ background: "#f4f6fb", fontSize: "0.75rem", fontWeight: 600, color: "#374151", border: "1px solid #e5e7eb" }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50"
      style={{ background: "white", border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 12px 40px rgba(0,0,0,0.14)", width: "240px", fontFamily: "Inter, sans-serif" }}>
      <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.03))" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "US"}</span>
          </div>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827" }}>{user?.name || "User"}</p>
            <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{user?.role || "Staff"} · Clinic</p>
          </div>
        </div>
      </div>
      {[
        { icon: User,     label: "Hồ sơ của tôi",    action: () => { navigate("/clinic/profile"); onClose(); } },
        { icon: Settings, label: "Cài đặt phòng khám", action: () => { navigate("/clinic/settings"); onClose(); } },
        { icon: HelpCircle,label: "Hỗ trợ & Trợ giúp", action: () => { onClose(); } },
      ].map(({ icon: Icon, label, action }) => (
        <button key={label} onClick={action}
          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
          <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#9ca3af" }} />
          <span style={{ fontSize: "0.82rem", color: "#374151" }}>{label}</span>
        </button>
      ))}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <button onClick={() => { logout(); navigate("/"); onClose(); }}
          className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 transition-colors text-left">
          <LogOut className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
          <span style={{ fontSize: "0.82rem", color: "#dc2626", fontWeight: 700 }}>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

interface DashboardTopbarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  showTitle?: boolean;
  onMenuClick?: () => void;
}

export function DashboardTopbar({ title, breadcrumbs = [], showTitle = false, onMenuClick }: DashboardTopbarProps) {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs]   = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  const [showAvatar, setShowAvatar]   = useState(false);
  const unread = NOTIF_DATA.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className="flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b flex-shrink-0"
        style={{ borderColor: "rgba(0,0,0,0.07)", height: "65px", fontFamily: "Inter, sans-serif" }}>
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded-lg border hover:bg-gray-50 transition-colors flex-shrink-0"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <div className="flex flex-col justify-center">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 mb-0.5">
                {breadcrumbs.map((crumb, i) => (
                  <span key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-blue-600 transition-colors"
                        style={{ fontSize: "0.72rem", fontWeight: 500, color: "#9ca3af", textDecoration: "none" }}>
                        {crumb.label}
                      </Link>
                    ) : (
                      <span style={{ fontSize: "0.72rem", fontWeight: 500, color: "#9ca3af" }}>{crumb.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" style={{ color: "#d1d5db" }} />}
                  </span>
                ))}
              </nav>
            )}
            {showTitle && (
              <h1 className="text-gray-900" style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2 }}>
                {title}
              </h1>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <button onClick={() => setShowSearch(true)}
            className="relative hidden md:flex items-center gap-2.5 pl-9 pr-4 py-2 rounded-xl hover:border-blue-300 transition-colors"
            style={{ background: "#f9fafb", border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.83rem", color: "#9ca3af", width: "220px" }}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9ca3af" }} />
            Tìm kiếm bất cứ thứ gì…
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded"
              style={{ background: "#e5e7eb", fontSize: "0.6rem", fontWeight: 600, color: "#9ca3af", fontFamily: "monospace" }}>
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button onClick={() => setShowNotifs(true)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-50"
            style={{ border: "1.5px solid rgba(0,0,0,0.08)" }}>
            <Bell className="w-4 h-4 text-gray-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center px-1"
                style={{ background: "#F97316", border: "1.5px solid white", fontSize: "0.5rem", fontWeight: 900, color: "white" }}>
                {unread}
              </span>
            )}
          </button>

          {/* Visit site */}
          <Link to="/"
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-150 hover:bg-gray-50"
            style={{ border: "1.5px solid rgba(0,0,0,0.08)", fontSize: "0.8rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}>
            <ExternalLink className="w-3.5 h-3.5" />
            Truy cập website
          </Link>

          {/* Avatar */}
          <div className="relative">
            <button onClick={() => setShowAvatar(v => !v)}
              className="flex items-center gap-1.5 px-1.5 py-1 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "US"}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
            </button>
            {showAvatar && <AvatarDropdown onClose={() => setShowAvatar(false)} />}
          </div>
        </div>
      </header>

      {/* Modals */}
      {showNotifs && <NotificationsPanel onClose={() => setShowNotifs(false)} />}
      {showSearch  && <SearchModal       onClose={() => setShowSearch(false)}  />}
    </>
  );
}
