import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { bookingService } from "@/api/bookingService";
import {
  PawPrint,
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut,
  Zap,
  Kanban,
  Package,
  FileText,
  X,
  MessageCircle,
  BookOpen,
  Phone,
  Mail,
  CheckCircle2,
  ShoppingBag,
  Globe,
  UtensilsCrossed,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";
import { useFeature } from "@/hooks/useFeature";
import { useTenant } from "@/context/TenantContext";
import { resolveMinioUrl } from "@/utils/file";

const navGroups = [
  {
    label: "KHÔNG GIAN LÀM VIỆC",
    items: [
      { id: "overview",     label: "Tổng quan",        icon: LayoutDashboard, href: "/clinic"                    },
      { id: "appointments", label: "Lịch hẹn",         icon: CalendarDays,    href: "/clinic/appointments" },
      { id: "taskboard",    label: "Bảng công việc",   icon: Kanban,          href: "/clinic/taskboard"    },
      { id: "patients",     label: "Bệnh nhân",         icon: Stethoscope,     href: "/clinic/patients"          },
      { id: "customers",    label: "Khách hàng",        icon: Users,           href: "/clinic/customers"          },
      { id: "medical",      label: "Hồ sơ y tế",       icon: FileText,        href: "/clinic/medical-records"   },
      { id: "pos",          label: "POS thông minh",   icon: ShoppingCart,    href: "/clinic/pos"               },
      { id: "inventory",    label: "Kho hàng",          icon: Package,         href: "/clinic/inventory"  },
      { id: "catalog",      label: "Danh mục",          icon: BookOpen,        href: "/clinic/catalog"            },
      { id: "crm",          label: "CRM",               icon: MessageCircle,   href: "/clinic/crm",          ownerOnly: true },
    ],
  },
  {
    label: "CỬA HÀNG BÁN LẺ",
    items: [
      { id: "retail-shop",    label: "Website cửa hàng",  icon: Globe,           href: "/" },
      { id: "retail-orders",  label: "Đơn hàng online",   icon: UtensilsCrossed, href: "/clinic/pos" },
    ],
  },
  {
    label: "PHÂN TÍCH",
    items: [
      { id: "reports", label: "Báo cáo", icon: BarChart3, href: "/clinic/reports" },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      { id: "billing",  label: "Thanh toán",  icon: CreditCard, href: "/clinic/billing",  ownerOnly: true },
      { id: "staff",    label: "Nhân sự",     icon: Users,      href: "/clinic/staff",    ownerOnly: true },
      { id: "settings", label: "Cài đặt",     icon: Settings,   href: "/clinic/settings", ownerOnly: true },
    ],
  },
];

function HelpModal({ onClose }: { onClose: () => void }) {
  const [ticketSent, setTicketSent] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Hỗ trợ & Trợ giúp</h2>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>Đội ngũ hỗ trợ PetTech · Phản hồi trung bình 4 phút</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3">
          {[
            { icon: BookOpen,      color: "#2563EB", label: "Tài liệu hướng dẫn",    sub: "Hướng dẫn, bài học & API docs"            },
            { icon: MessageCircle, color: "#16a34a", label: "Chat trực tiếp",           sub: "Chat với hỗ trợ — đang online"              },
            { icon: Phone,         color: "#F97316", label: "Đặt lịch gọi điện",        sub: "Đặt lịch onboarding 30 phút"                },
            { icon: Mail,          color: "#7c3aed", label: "Email hỗ trợ",             sub: "support@pettech.io · Phản hồi trong 24h"    },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors hover:bg-gray-50 w-full"
                style={{ border: "1.5px solid #e5e7eb" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: item.color }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{item.label}</p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{item.sub}</p>
                </div>
              </button>
            );
          })}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: "12px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Gửi tin nhắn nhanh</p>
            {ticketSent ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "#dcfce7" }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a" }}>Đã gửi! Chúng tôi sẽ phản hồi trong 4 phút.</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  placeholder="Mô tả vấn đề của bạn…"
                  className="flex-1 px-3 py-2.5 rounded-xl outline-none"
                  style={{ fontSize: "0.8rem", color: "#374151", background: "#f9fafb", border: "1.5px solid #e5e7eb", fontFamily: "Inter, sans-serif" }} />
                <button onClick={() => { if (msg.trim()) setTicketSent(true); }}
                  className="px-4 py-2.5 rounded-xl transition-colors"
                  style={{ background: msg.trim() ? "#2563EB" : "#e5e7eb", color: msg.trim() ? "white" : "#9ca3af", fontSize: "0.78rem", fontWeight: 700 }}>
                  Gửi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-white p-7 flex flex-col gap-5"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#fee2e2" }}>
            <LogOut className="w-6 h-6" style={{ color: "#dc2626" }} />
          </div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đăng xuất?</h2>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>
            Bạn sẽ được chuyển về trang đăng nhập. Mọi thay đổi chưa lưu có thể bị mất.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl"
            style={{ background: "#f4f6fb", color: "#374151", fontSize: "0.85rem", fontWeight: 700 }}>
            Hủy
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl"
            style={{ background: "linear-gradient(135deg,#dc2626,#b91c1c)", color: "white", fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(220,38,38,0.3)" }}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

function UpgradePromptModal({ onClose, onUpgrade, featureId }: { onClose: () => void; onUpgrade: () => void; featureId: string }) {
  const isCrm = featureId === "crm";
  const featureName = isCrm ? "Chăm sóc khách hàng (CRM)" : "Bảng công việc (Live Tracking)";
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-white p-7 flex flex-col gap-6"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#fef3c7" }}>
            <Lock className="w-6 h-6" style={{ color: "#d97706" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#111827" }}>Tính năng chưa mở khóa</h2>
            <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
              Vui lòng nâng cấp gói để mở khóa tính năng <strong>{featureName}</strong>!
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2.5" style={{ border: "1px solid #e5e7eb" }}>
          {isCrm ? (
            <>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Gửi tin nhắn chăm sóc tự động cho chủ nuôi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Chiến dịch tiếp thị & Khuyến mãi cá nhân hóa</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Báo cáo phân tích hành vi khách hàng chuyên sâu</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Bảng kéo thả Kanban trực quan theo thời gian thực</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Cập nhật trạng thái tự động sang cổng khách hàng</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold text-xs" style={{ marginTop: "2px" }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "#4b5563" }}>Phối hợp công việc giữa các phòng ban mượt mà</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl transition-colors hover:bg-gray-100"
            style={{ background: "#f3f4f6", color: "#374151", fontSize: "0.85rem", fontWeight: 700 }}>
            Hủy
          </button>
          <button onClick={onUpgrade} className="flex-1 py-3 rounded-xl transition-colors hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(249,115,22,0.3)" }}>
            Nâng cấp ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const { hasCrm, hasLiveTracking } = useFeature();
  const { tenant, settings } = useTenant();
  const shopName = settings?.customShopName || tenant?.name || "PetTech";
  const logoUrl = settings?.customLogoUrl || tenant?.logoUrl;
  const [collapsed, setCollapsed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState<string | null>(null);
  const [showNotifDot, setShowNotifDot] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [inventoryCount, setInventoryCount] = useState<number | null>(null);
  const [notifCount, setNotifCount] = useState<number | null>(null);
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>({});
  const [seenNotifCount, setSeenNotifCount] = useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await bookingService.getBookings();
        let list: any[] = [];
        if (res && res.isSuccess) {
          const payload = res.value || res.data || res;
          if (Array.isArray(payload)) list = payload;
          else if (Array.isArray(payload.items)) list = payload.items;
        } else if (res) {
          if (Array.isArray(res)) list = res;
          else if (Array.isArray(res.items)) list = res.items;
        }

        if (Array.isArray(list)) {
          // 1. Total active appointments count (Confirmed, CheckedIn, InProgress)
          const activeBookings = list.filter(
            b => b.status === "Confirmed" || b.status === "CheckedIn" || b.status === "InProgress"
          );
          setBookingCount(activeBookings.length);

          // 2. Taskboard count (bookings in progress or checked in)
          const inProgressBookings = list.filter(
            b => b.status === "InProgress" || b.status === "CheckedIn"
          );
          setTaskCount(inProgressBookings.length);

          // 3. Online orders badge (Confirmed status bookings as mock orders count)
          const confirmedBookings = list.filter(b => b.status === "Confirmed");
          setOrderCount(confirmedBookings.length);

          // 4. Notifications count (bookings today)
          const todayStr = new Date().toISOString().split("T")[0];
          const todayBookings = list.filter(b => b.bookingDate && b.bookingDate.startsWith(todayStr));
          setNotifCount(todayBookings.length);
        }

        // Fetch inventory to count low stock
        try {
          const invRes: any = await import("@/api/services").then(m => m.posService.getProducts());
          let products = [];
          if (invRes && invRes.isSuccess) {
            products = invRes.value || invRes.data || invRes;
          } else if (invRes) {
            products = invRes.items || invRes.data || invRes;
          }
          if (Array.isArray(products)) {
            const lowStock = products.filter(p => (p.stock ?? p.stockQty ?? p.stockQuantity ?? 10) < 10);
            setInventoryCount(lowStock.length);
          }
        } catch (invErr) {}

      } catch (err) {
        console.error("Failed to fetch sidebar counts:", err);
      }
    };

    fetchCounts();
    // Removed the 30-second interval polling here to prevent server/database 
    // overload when many shops are active simultaneously. 
    // Badges will update on mount. Real-time updates should ideally use SignalR.
  }, []);

  // Update seen counts when visiting pages
  useEffect(() => {
    if (location.pathname === "/clinic/appointments" && bookingCount !== null) {
      setSeenCounts(prev => ({ ...prev, appointments: bookingCount }));
    }
    if (location.pathname === "/clinic/taskboard" && taskCount !== null) {
      setSeenCounts(prev => ({ ...prev, taskboard: taskCount }));
    }
    if (location.pathname === "/clinic/pos" && orderCount !== null) {
      setSeenCounts(prev => ({ ...prev, "retail-orders": orderCount }));
    }
    if (location.pathname === "/clinic/inventory" && inventoryCount !== null) {
      setSeenCounts(prev => ({ ...prev, inventory: inventoryCount }));
    }
  }, [location.pathname, bookingCount, taskCount, orderCount, inventoryCount]);

  const isOwner = user?.role === Role.ShopManager;
  const isActive = (href: string) => location.pathname === href;
  
  const unreadNotifs = Math.max(0, (notifCount || 0) - seenNotifCount);
  const showNotifDotActual = unreadNotifs > 0;

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <aside
        className="relative flex flex-col h-screen flex-shrink-0 transition-all duration-300"
        style={{ width: collapsed ? "72px" : "256px", background: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)", fontFamily: "Inter, sans-serif" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", height: "65px" }}>
          {logoUrl ? (
            <img 
              src={resolveMinioUrl(logoUrl)} 
              alt={shopName} 
              className="w-9 h-9 rounded-xl object-contain bg-slate-50 border p-0.5 flex-shrink-0" 
              style={{ borderColor: 'rgba(255,255,255,0.08)' }} 
            />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB) 0%, color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, black) 100%)" }}>
              <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          )}
          {!collapsed && (
            <div className="flex items-baseline gap-0.5 overflow-hidden w-full">
              {settings?.customShopName || tenant?.name ? (
                <span className="text-white truncate" style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {settings.customShopName || tenant?.name}
                </span>
              ) : (
                <>
                  <span className="text-white" style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Pet</span>
                  <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "color-mix(in srgb, var(--primary-theme-color, #2563EB) 80%, white)", letterSpacing: "-0.02em" }}>Tech</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-6 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 mb-2"
                  style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.09em" }}>
                  {group.label}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const isLocked = (item as any).ownerOnly && !isOwner;
                  const isFeatureLocked = (item.id === "crm" && !hasCrm) || (item.id === "taskboard" && !hasLiveTracking);

                  let badgeValue = (item as any).badge;
                  let actualCount = 0;
                  
                  if (item.id === "appointments" && bookingCount !== null) actualCount = bookingCount;
                  else if (item.id === "taskboard" && taskCount !== null) actualCount = taskCount;
                  else if (item.id === "retail-orders" && orderCount !== null) actualCount = orderCount;
                  else if (item.id === "inventory" && inventoryCount !== null) actualCount = inventoryCount;

                  if (["appointments", "taskboard", "retail-orders", "inventory"].includes(item.id)) {
                    const seen = seenCounts[item.id] || 0;
                    const unread = Math.max(0, actualCount - seen);
                    if (active || unread === 0) {
                      badgeValue = null;
                    } else {
                      badgeValue = unread.toString();
                    }
                  }

                  return (
                    <li key={item.id} style={{ opacity: (isLocked || isFeatureLocked) ? 0.4 : 1 }}>
                      <Link to={(isLocked || isFeatureLocked) ? "#" : item.href} title={collapsed ? item.label : undefined}
                        onClick={(e) => {
                          if (isFeatureLocked) {
                            e.preventDefault();
                            setShowUpgradePrompt(item.id);
                          }
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${(isLocked || isFeatureLocked) ? "cursor-not-allowed" : ""}`}
                        style={{ background: active && !isFeatureLocked ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 18%, transparent)" : "transparent", textDecoration: "none" }}>
                        {active && !isFeatureLocked && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: "var(--primary-theme-color, #2563EB)" }} />}
                        <Icon className="w-5 h-5 flex-shrink-0 transition-colors"
                          style={{ color: active && !isFeatureLocked ? "color-mix(in srgb, var(--primary-theme-color, #2563EB) 85%, white)" : "rgba(255,255,255,0.45)" }}
                          strokeWidth={active && !isFeatureLocked ? 2.5 : 2} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 transition-colors"
                              style={{ fontSize: "0.875rem", fontWeight: active && !isFeatureLocked ? 600 : 500, color: active && !isFeatureLocked ? "#f0f6ff" : "rgba(255,255,255,0.6)" }}>
                              {item.label}
                            </span>
                            {isLocked && <Settings className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} />}
                            {isFeatureLocked && <Lock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.35)" }} />}
                            {badgeValue && !isLocked && !isFeatureLocked && (
                              <span className="px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(249,115,22,0.2)", fontSize: "0.7rem", fontWeight: 700, color: "#fb923c" }}>
                                {badgeValue}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom utility */}
        <div className="border-t px-2 py-3 flex flex-col gap-0.5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <Link
            to="/"
            title={collapsed ? "Back to Shop Website" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all hover:bg-white/10 group"
            style={{ textDecoration: "none", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.18)", marginBottom: "6px" }}
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0 transition-colors" style={{ color: "#fb923c" }} />
            {!collapsed && (
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fb923c", flex: 1 }}>
                Về trang cửa hàng
              </span>
            )}
          </Link>
          <button
            onClick={() => { setSeenNotifCount(notifCount || 0); navigate("/clinic"); }}
            title={collapsed ? "Notifications" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-colors hover:bg-white/5 relative">
            <Bell className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            {showNotifDotActual && (
              <span className="absolute top-2 left-6 w-2 h-2 rounded-full"
                style={{ background: "#F97316", border: "1.5px solid #0f172a" }} />
            )}
            {!collapsed && (
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>
                Thông báo
              </span>
            )}
            {!collapsed && showNotifDotActual && (
              <span className="ml-auto px-2 py-0.5 rounded-full"
                style={{ background: "rgba(249,115,22,0.2)", fontSize: "0.65rem", fontWeight: 700, color: "#fb923c" }}>
                {unreadNotifs}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowHelp(true)}
            title={collapsed ? "Help & Support" : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-colors hover:bg-white/5">
            <HelpCircle className="w-5 h-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            {!collapsed && (
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>Hỗ trợ & Trợ giúp</span>
            )}
          </button>
        </div>

        {/* User profile */}
        <div className="border-t px-3 py-4 flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--primary-theme-color, #2563EB) 0%, #7c3aed 100%)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>{user?.name?.substring(0, 2).toUpperCase() || "US"}</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: "#22c55e", borderColor: "#0f172a" }} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Guest User"}
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.role || "Staff"} • {settings?.customShopName || tenant?.name || "PetTech Clinic"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setShowLogout(true)}
              className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
              title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-blue-600"
          style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.12)" }}>
          {collapsed
            ? <ChevronRight className="w-3 h-3 text-white/60" />
            : <ChevronLeft  className="w-3 h-3 text-white/60" />}
        </button>
      </aside>

      {showHelp   && <HelpModal   onClose={() => setShowHelp(false)} />}
      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} onConfirm={() => { logout(); setShowLogout(false); navigate("/"); }} />}
      {showUpgradePrompt && (
        <UpgradePromptModal 
          featureId={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(null)} 
          onUpgrade={() => {
            setShowUpgradePrompt(null);
            navigate("/clinic/billing");
          }} 
        />
      )}
    </>
  );
}
