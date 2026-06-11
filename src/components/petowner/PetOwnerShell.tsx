import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ShoppingBag, CalendarDays, PawPrint, ClipboardList,
  Bell, ShoppingCart, LogOut, X,
  Star, Menu, Zap, Settings,
  LayoutDashboard, ExternalLink, Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTenant } from "@/context/TenantContext";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead
} from "@/hooks/petowner/useNotifications";
import { useMyLoyaltyAccount } from "@/hooks/petowner/useLoyalty";


const NAV_ITEMS = [
  { id: "home",    label: "Trang chủ",   icon: LayoutDashboard, href: "/owner"          },
  { id: "shop",    label: "Cửa hàng",    icon: ShoppingBag,     href: "/owner/shop"     },
  { id: "book",    label: "Đặt lịch",    icon: CalendarDays,    href: "/owner/booking"  },
  { id: "pets",    label: "Thú cưng",    icon: PawPrint,        href: "/owner/pets"     },
  { id: "orders",  label: "Đơn hàng",    icon: Package,         href: "/owner/orders"   },
  { id: "history", label: "Lịch sử",     icon: ClipboardList,   href: "/owner/history"  },
];

const NAV_BOTTOM = [
  { id: "loyalty", label: "Điểm thưởng", icon: Star,     href: "/owner/loyalty"  },
  { id: "profile", label: "Cài đặt",     icon: Settings, href: "/owner/profile"  },
];

function formatNotifTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const diffMs = new Date().getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long" });
  } catch {
    return "Gần đây";
  }
}

function NotifPanel({ onClose }: { onClose: () => void }) {
  const { data: notificationsData } = useNotifications({ pageNumber: 1, pageSize: 20 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const rawData = notificationsData as any;
  const notifs = rawData?.items || rawData?.Items || [];
  const unreadCount = rawData?.unreadCount ?? rawData?.UnreadCount ?? 0;

  return (
    <div className="fixed inset-0 z-[200]" style={{ fontFamily: "Inter, sans-serif" }} onClick={onClose}>
      <div className="absolute right-4 top-16 w-96 rounded-2xl overflow-hidden"
        style={{ background: "white", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", border: "1px solid #e5e7eb" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div>
            <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Thông báo</p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{unreadCount} chưa đọc</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              style={{ fontSize: "0.72rem", fontWeight: 600, color: "#2563EB" }}>
              {markAllReadMutation.isPending ? "Đang xử lý..." : "Đọc tất cả"}
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
              <X className="w-3.5 h-3.5" style={{ color: "#374151" }} />
            </button>
          </div>
        </div>
        <div className="flex flex-col divide-y" style={{ borderColor: "#f3f4f6", maxHeight: "360px", overflowY: "auto" }}>
          {notifs.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400 font-semibold">
              Chưa có thông báo nào
            </div>
          ) : (
            notifs.map((n: any) => (
              <div 
                key={n.id} 
                className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/50" 
                onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                style={{ background: !n.isRead ? "rgba(37,99,235,0.02)" : "white" }}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base" style={{ background: "#f3f4f6" }}>
                  {n.icon || "🔔"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#2563EB" }} />}
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#6b7280", marginTop: "1px", lineHeight: 1.4 }}>{n.content}</p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "4px" }}>{formatNotifTime(n.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl bg-white p-7 flex flex-col gap-5 text-center"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "#fee2e2" }}>
          <LogOut className="w-6 h-6" style={{ color: "#dc2626" }} />
        </div>
        <div>
          <p style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>Đăng xuất?</p>
          <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>Bạn sẽ được chuyển về trang chủ PetTech.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl" style={{ background: "#f4f6fb", color: "#374151", fontSize: "0.85rem", fontWeight: 700 }}>Hủy</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "white", fontSize: "0.85rem", fontWeight: 700 }}>Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}

interface PetOwnerShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  cartCount?: number;
  clinicName?: string;
}

export function PetOwnerShell({
  children,
  pageTitle = "Bảng điều khiển",
  cartCount = 0,
  clinicName = "Phòng khám Paws & Claws",
}: PetOwnerShellProps) {
  const { user, logout } = useAuth();
  const { settings } = useTenant();
  const location = useLocation();
  const navigate  = useNavigate();
  const [showNotif,   setShowNotif]   = useState(false);
  const [showLogout,  setShowLogout]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: dbUnreadCount = 0 } = useUnreadNotificationCount();
  const unreadCount = dbUnreadCount;

  const { data: loyaltyAccount } = useMyLoyaltyAccount();
  const loyaltyPoints = (loyaltyAccount as any)?.points ?? 0;
  const currentTierName = (loyaltyAccount as any)?.currentTier?.name ?? 
    (loyaltyPoints >= 1000 ? "Bạch kim" : loyaltyPoints >= 500 ? "Vàng" : loyaltyPoints >= 200 ? "Bạc" : "Đồng");

  let nextTierName = "Bạc";
  let nextTierPoints = 200;
  if (loyaltyPoints >= 1000) {
    nextTierName = "";
    nextTierPoints = 1000;
  } else if (loyaltyPoints >= 500) {
    nextTierName = "Bạch kim";
    nextTierPoints = 1000;
  } else if (loyaltyPoints >= 200) {
    nextTierName = "Vàng";
    nextTierPoints = 500;
  } else {
    nextTierName = "Bạc";
    nextTierPoints = 200;
  }
  const pointsNeeded = Math.max(0, nextTierPoints - loyaltyPoints);

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.id === "book" && settings.acceptOnlineBookings === false) {
      return false;
    }
    return true;
  });

  const activeId = [...filteredNavItems, ...NAV_BOTTOM].find(n =>
    location.pathname === n.href ||
    (n.id !== "home" && location.pathname.startsWith(n.href))
  )?.id ?? "home";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>

      <aside
        style={{
          width: sidebarOpen ? "260px" : "72px",
          minHeight: "100vh",
          background: "white",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 20,
        }}
      >
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid #f3f4f6", minHeight: "72px" }}>
          <div className="flex items-center justify-center flex-shrink-0 rounded-xl"
            style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
            <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>PetTech</p>
              <p style={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" }}>{clinicName}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1" style={{ overflowY: "auto" }}>
          <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", paddingLeft: sidebarOpen ? "8px" : "0", textAlign: sidebarOpen ? "left" : "center", marginBottom: "6px" }}>
            {sidebarOpen ? "MENU" : ""}
          </p>
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            const active = activeId === item.id;
            return (
              <Link key={item.id} to={item.href} style={{ textDecoration: "none" }} title={!sidebarOpen ? item.label : undefined}>
                <div className="flex items-center gap-3 rounded-xl transition-all"
                  style={{
                    padding: sidebarOpen ? "10px 12px" : "10px",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    background: active ? "rgba(37,99,235,0.08)" : "transparent",
                    border: active ? "1px solid rgba(37,99,235,0.15)" : "1px solid transparent",
                  }}>
                  <Icon style={{ width: "18px", height: "18px", flexShrink: 0, color: active ? "#2563EB" : "#6b7280" }} strokeWidth={active ? 2.5 : 2} />
                  {sidebarOpen && (
                    <span style={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#374151", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
          <div style={{ borderTop: "1px solid #f3f4f6", margin: "8px 0" }} />
          {NAV_BOTTOM.map(item => {
            const Icon = item.icon;
            const active = activeId === item.id;
            return (
              <Link key={item.id} to={item.href} style={{ textDecoration: "none" }} title={!sidebarOpen ? item.label : undefined}>
                <div className="flex items-center gap-3 rounded-xl transition-all"
                  style={{
                    padding: sidebarOpen ? "10px 12px" : "10px",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    background: active ? "rgba(37,99,235,0.08)" : "transparent",
                    border: active ? "1px solid rgba(37,99,235,0.15)" : "1px solid transparent",
                  }}>
                  <Icon style={{ width: "18px", height: "18px", flexShrink: 0, color: active ? "#2563EB" : "#6b7280" }} strokeWidth={active ? 2.5 : 2} />
                  {sidebarOpen && (
                    <span style={{ fontSize: "0.85rem", fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#374151", whiteSpace: "nowrap" }}>
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="px-3 pb-3">
            <Link to="/owner/loyalty" style={{ textDecoration: "none" }}>
              <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: "linear-gradient(135deg,#f59e0b,#F97316)" }}>
                <Zap className="w-4 h-4 text-white flexShrink-0" />
                <div className="min-w-0">
                  <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "white" }}>{loyaltyPoints} pts · {currentTierName}</p>
                  <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.75)" }}>
                    {pointsNeeded > 0 ? `${pointsNeeded} pts lên ${nextTierName}` : "Đạt cấp tối đa 🎉"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="px-3 pb-4" style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
          <button onClick={() => setShowLogout(true)} className="flex items-center gap-3 w-full rounded-xl transition-all"
            style={{ padding: sidebarOpen ? "10px 12px" : "10px", justifyContent: sidebarOpen ? "flex-start" : "center" }}
            title={!sidebarOpen ? "Đăng xuất" : undefined}>
            <div className="flex items-center justify-center flexShrink-0 text-white rounded-full"
              style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#F97316,#ea580c)", fontSize: "0.7rem", fontWeight: 800 }}>
              {user?.name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "User"}</p>
                <p style={{ fontSize: "0.62rem", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Đăng xuất</p>
              </div>
            )}
            {sidebarOpen && <LogOut className="w-4 h-4 flexShrink-0" style={{ color: "#9ca3af" }} />}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ height: "64px", background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 24px", gap: "16px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <button onClick={() => setSidebarOpen(v => !v)} className="flex items-center justify-center rounded-xl" style={{ width: "36px", height: "36px", background: "#f3f4f6", flexShrink: 0 }}>
            <Menu className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2">
              <p style={{ fontSize: "0.65rem", color: "#9ca3af", letterSpacing: "0.06em" }}>CỔNG CHỦ THÚ CƯNG</p>
              <span style={{ color: "#d1d5db", fontSize: "0.65rem" }}>/</span>
              <p style={{ fontSize: "0.65rem", color: "#6b7280", fontWeight: 600 }}>{pageTitle}</p>
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{pageTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/owner/shop" style={{ textDecoration: "none" }}>
              <div className="relative flex items-center justify-center rounded-xl" style={{ width: "40px", height: "40px", background: "#f3f4f6" }}>
                <ShoppingCart className="w-4.5 h-4.5" style={{ color: "#374151" }} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full flex items-center justify-center text-white"
                    style={{ background: "#F97316", fontSize: "0.55rem", fontWeight: 800, minWidth: "18px", minHeight: "18px", padding: "0 3px" }}>
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
            <button onClick={() => setShowNotif(v => !v)} className="relative flex items-center justify-center rounded-xl"
              style={{ width: "40px", height: "40px", background: showNotif ? "rgba(37,99,235,0.08)" : "#f3f4f6", border: showNotif ? "1.5px solid rgba(37,99,235,0.2)" : "none" }}>
              <Bell className="w-4.5 h-4.5" style={{ color: showNotif ? "#2563EB" : "#374151" }} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#F97316" }} />}
            </button>
            <Link to="/shop" style={{ textDecoration: "none" }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(249,115,22,0.08)", border: "1.5px solid rgba(249,115,22,0.25)" }}>
                <ExternalLink className="w-3.5 h-3.5 flexShrink-0" style={{ color: "#F97316" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F97316" }}>Về trang cửa hàng</span>
              </div>
            </Link>
            <button onClick={() => navigate("/owner/profile")} className="flex items-center justify-center rounded-full text-white flexShrink-0"
              style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#F97316,#ea580c)", fontSize: "0.78rem", fontWeight: 800 }}>
              {user?.name?.substring(0, 2).toUpperCase() || "US"}
            </button>
          </div>
        </header>
        <main style={{ flex: 1, padding: "28px 28px", minHeight: 0 }}>
          {children}
        </main>
      </div>
      {showNotif  && <NotifPanel onClose={() => setShowNotif(false)} />}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={() => { logout(); setShowLogout(false); navigate("/"); }} />}
    </div>
  );
}
