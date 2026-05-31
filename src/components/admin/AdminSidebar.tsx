import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  PawPrint, LayoutDashboard, Users, CreditCard,
  LifeBuoy, Settings, ShieldCheck, LogOut, ChevronRight,
  HelpCircle, X, MessageCircle, Mail, Phone,
  Lock, ExternalLink, Tag, Megaphone, BarChart3, ScrollText,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";

const NAV_GROUPS = [
  {
    label: "TỔNG QUAN",
    items: [
      { id: "overview", label: "Bảng điều khiển", icon: LayoutDashboard, href: "/admin"        },
      { id: "tenants",  label: "Quản lý Tenant",  icon: Users,           href: "/admin/tenants" },
      { id: "analytics", label: "Phân tích nền tảng", icon: BarChart3,   href: "/admin/analytics", adminOnly: true },
    ],
  },
  {
    label: "VẬN HÀNH",
    items: [
      { id: "billing", label: "Doanh thu & Thanh toán", icon: CreditCard, href: "/admin/billing", adminOnly: true },
      { id: "support", label: "Phiếu hỗ trợ",           icon: LifeBuoy,   href: "/admin/support"  },
      { id: "plans",   label: "Gói đăng ký",             icon: Tag,        href: "/admin/plans",   adminOnly: true },
      { id: "crm",     label: "CRM",                     icon: Megaphone,  href: "/admin/crm",     adminOnly: true },
    ],
  },
  {
    label: "QUẢN TRỊ",
    items: [
      { id: "users",  label: "Người dùng quản trị", icon: ShieldCheck, href: "/admin/users",  adminOnly: true },
      { id: "system", label: "Cài đặt hệ thống",    icon: Settings,    href: "/admin/system", adminOnly: true },
      { id: "logs",   label: "Nhật ký hoạt động",    icon: ScrollText,  href: "/admin/logs",   adminOnly: true },
    ],
  },
];

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-start p-4 pointer-events-none">
      <div
        className="pointer-events-auto rounded-2xl overflow-hidden"
        style={{ width: "300px", background: "white", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", border: "1px solid rgba(0,0,0,0.08)", fontFamily: "Inter, sans-serif" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" style={{ color: "#2563EB" }} />
            <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>Trợ giúp quản trị</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-3">
          {[
            { icon: MessageCircle, label: "Slack nội bộ",  sub: "#pettech-admin-ops" },
            { icon: Mail,          label: "Kỹ thuật",       sub: "eng@pettech.io" },
            { icon: Phone,         label: "Trực ban",       sub: "+1 800-PETTECH-1" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: "#f8faff", border: "1px solid rgba(37,99,235,0.08)" }}>
              <Icon className="w-4 h-4" style={{ color: "#2563EB" }} />
              <div>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111827" }}>{label}</p>
                <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = user?.role || Role.PlatformStaff;
  const isAdmin = role === Role.SuperAdmin;

  const activeId = (() => {
    const p = location.pathname;
    if (p === "/admin") return "overview";
    const seg = p.split("/")[2];
    return seg ?? "overview";
  })();

  const w = collapsed ? "64px" : "220px";

  return (
    <>
      <aside
        className="flex flex-col h-screen flex-shrink-0 transition-all duration-200"
        style={{ width: w, background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)", fontFamily: "Inter, sans-serif" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", height: "65px" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #7c3aed)" }}>
            <PawPrint className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p style={{ fontSize: "0.82rem", fontWeight: 900, color: "white", letterSpacing: "-0.01em", lineHeight: 1.1 }}>PetTech</p>
              <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "#7c3aed", letterSpacing: "0.08em" }}>CỔNG QUẢN TRỊ</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors flex-shrink-0">
              <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)", transform: "rotate(180deg)" }} />
            </button>
          )}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="hidden" />
          )}
        </div>
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="flex items-center justify-center py-2 hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
          </button>
        )}

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: isAdmin ? "rgba(124,58,237,0.15)" : "rgba(37,99,235,0.12)", border: `1px solid ${isAdmin ? "rgba(124,58,237,0.3)" : "rgba(37,99,235,0.25)"}` }}>
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isAdmin ? "#a78bfa" : "#60a5fa" }} />
              <div className="min-w-0">
                <p style={{ fontSize: "0.65rem", fontWeight: 800, color: isAdmin ? "#a78bfa" : "#60a5fa", letterSpacing: "0.07em" }}>
                  {isAdmin ? "SUPER ADMIN" : "NHÂN VIÊN HỖ TRỢ"}
                </p>
                <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>
                  {isAdmin ? "Toàn quyền truy cập" : "Quyền hạn chế"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-3" style={{ scrollbarWidth: "none" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-2 mb-1.5" style={{ fontSize: "0.55rem", fontWeight: 800, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const Icon       = item.icon;
                const isActive   = activeId === item.id;
                const isLocked   = (item as any).adminOnly && !isAdmin;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isLocked && navigate(item.href)}
                    title={collapsed ? item.label : undefined}
                    className="flex items-center gap-2.5 w-full rounded-xl mb-0.5 transition-all duration-150"
                    style={{
                      padding: collapsed ? "9px" : "8px 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(124,58,237,0.15))"
                        : "transparent",
                      border: isActive ? "1px solid rgba(37,99,235,0.35)" : "1px solid transparent",
                      opacity: isLocked ? 0.4 : 1,
                      cursor: isLocked ? "not-allowed" : "pointer",
                    }}
                  >
                    <Icon
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: isActive ? "#60a5fa" : "rgba(255,255,255,0.45)" }}
                    />
                    {!collapsed && (
                      <>
                        <span style={{ fontSize: "0.78rem", fontWeight: isActive ? 700 : 500, color: isActive ? "white" : "rgba(255,255,255,0.55)", flex: 1, textAlign: "left" }}>
                          {item.label}
                        </span>
                        {isLocked && <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} />}
                        {isActive && !isLocked && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#60a5fa" }} />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="flex-shrink-0 px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* ── Back to PetTech Homepage ── */}
          <Link
            to="/"
            title={collapsed ? "Back to PetTech Home" : undefined}
            className="flex items-center gap-2.5 w-full rounded-xl mb-2 transition-all hover:bg-white/10"
            style={{
              padding: collapsed ? "9px" : "8px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              textDecoration: "none",
              background: "rgba(249,115,22,0.08)",
              border: "1px solid rgba(249,115,22,0.18)",
            }}
          >
            <ExternalLink
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#fb923c" }}
            />
            {!collapsed && (
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fb923c", flex: 1, textAlign: "left" }}>
                Về trang chủ PetTech
              </span>
            )}
          </Link>
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #2563EB, #7c3aed)" }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "SA"}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  {isAdmin ? "System Admin" : "Nhân viên hỗ trợ"}
                </p>
                <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{user?.email || "admin@pettech.io"}</p>
              </div>
            </div>
          )}
          <div className="flex gap-1.5">
            <button onClick={() => setShowHelp(v => !v)} title="Help" className="flex items-center justify-center rounded-xl transition-colors hover:bg-white/10" style={{ flex: 1, height: "34px" }}>
              <HelpCircle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
            </button>
            <button onClick={() => { logout(); navigate("/"); }} title="Sign Out" className="flex items-center justify-center rounded-xl transition-colors hover:bg-red-500/10" style={{ flex: 1, height: "34px" }}>
              <LogOut className="w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
            </button>
          </div>
        </div>
      </aside>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
