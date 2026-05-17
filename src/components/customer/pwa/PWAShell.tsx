import { useState } from "react";
import {
  PawPrint,
  X,
  Home,
  CalendarDays,
  Activity,
  MessageCircle,
  Wallet,
  User,
  ChevronRight,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  Star,
} from "lucide-react";

const DRAWER_ITEMS = [
  { icon: Home,          label: "Home",             sub: "Dashboard & pet overview", badge: null, accent: "#2563EB" },
  { icon: CalendarDays,  label: "Book Appointment", sub: "Schedule a visit",          badge: 1,    accent: "#2563EB" },
  { icon: Activity,      label: "Live Tracking",    sub: "Track your pet's session",  badge: null, accent: "#F97316" },
  { icon: MessageCircle, label: "Chat",              sub: "Messages & notifications",  badge: 3,    accent: "#7c3aed" },
  { icon: Wallet,        label: "eWallet",           sub: "Balance & transaction log",  badge: null, accent: "#d97706" },
  { icon: User,          label: "My Profile",       sub: "Account & preferences",     badge: null, accent: "#16a34a" },
];

// ─── Hamburger icon (3-line) ──────────────────────────────────────────────────
function HamburgerIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all active:scale-90 hover:bg-gray-50"
      aria-label="Open navigation menu"
    >
      <span style={{ display: "block", width: "20px", height: "2.5px", background: "#1f2937", borderRadius: "2px", marginBottom: "4px" }} />
      <span style={{ display: "block", width: "20px", height: "2.5px", background: "#1f2937", borderRadius: "2px", marginBottom: "4px" }} />
      <span style={{ display: "block", width: "13px", height: "2.5px", background: "#1f2937", borderRadius: "2px", alignSelf: "flex-start", marginLeft: "2px" }} />
    </button>
  );
}

// ─── Sticky web header ────────────────────────────────────────────────────────
function PWAHeader({ onHamburger }: { onHamburger: () => void }) {
  return (
    <header
      className="flex items-center justify-between px-4 flex-shrink-0"
      style={{
        height: "58px",
        background: "white",
        borderBottom: "1.5px solid rgba(0,0,0,0.07)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        zIndex: 10,
        position: "relative",
      }}
    >
      {/* LEFT: Hamburger */}
      <HamburgerIcon onClick={onHamburger} />

      {/* CENTER: PetTech Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)" }}
        >
          <PawPrint className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "-0.03em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Pet<span style={{ color: "#2563EB" }}>Tech</span>
        </span>
      </div>

      {/* RIGHT: Bell + Avatar */}
      <div className="flex items-center gap-1">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-4.5 h-4.5" style={{ color: "#6b7280" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#F97316", border: "1.5px solid white" }}
          />
        </button>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #7c3aed 100%)",
            border: "2px solid rgba(37,99,235,0.2)",
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          <span style={{ fontSize: "0.68rem", fontWeight: 900, color: "white" }}>SL</span>
        </button>
      </div>
    </header>
  );
}

// ─── Hamburger Drawer ─────────────────────────────────────────────────────────
function PWADrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          animation: "pwaFadeIn 0.2s ease both",
        }}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className="absolute top-0 left-0 bottom-0 flex flex-col overflow-hidden"
        style={{
          width: "290px",
          background: "white",
          boxShadow: "12px 0 48px rgba(0,0,0,0.22)",
          animation: "pwaDrawerSlide 0.3s cubic-bezier(0.32,0.72,0,1) both",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1.5px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB, #7c3aed)" }}
            >
              <PawPrint className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
              Pet<span style={{ color: "#2563EB" }}>OS</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100 active:scale-90"
          >
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* User profile card */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(124,58,237,0.05))",
            borderBottom: "1.5px solid rgba(0,0,0,0.07)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #2563EB, #7c3aed)",
                boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
              }}
            >
              <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "white" }}>SL</span>
            </div>
            <div className="min-w-0">
              <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#111827" }}>Sarah Lee</p>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "1px" }}>sarah@petowner.com</p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(249,115,22,0.1)", fontSize: "0.58rem", fontWeight: 800, color: "#F97316" }}
                >
                  🏅 Gold Member
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5" style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#9ca3af" }}>2,840 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: "none" }}>
          {DRAWER_ITEMS.map(({ icon: Icon, label, sub, badge, accent }) => (
            <button
              key={label}
              onClick={onClose}
              className="flex items-center justify-between w-full px-4 py-3 transition-all hover:bg-gray-50 active:bg-blue-50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${accent}12` }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 text-left">
                  <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "#1f2937" }}>{label}</p>
                  <p style={{ fontSize: "0.62rem", color: "#9ca3af", marginTop: "1px" }}>{sub}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                {badge && (
                  <span
                    className="min-w-5 h-5 px-1 rounded-full flex items-center justify-center"
                    style={{ background: "#F97316", fontSize: "0.58rem", fontWeight: 900, color: "white" }}
                  >
                    {badge}
                  </span>
                )}
                <ChevronRight className="w-3.5 h-3.5" style={{ color: "#d1d5db" }} />
              </div>
            </button>
          ))}

          {/* Divider */}
          <div className="mx-4 my-2" style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />

          {[
            { icon: Shield,     label: "Privacy & Security" },
            { icon: Settings,   label: "Settings"           },
            { icon: HelpCircle, label: "Help & Support"     },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={onClose}
              className="flex items-center gap-3 w-full px-4 py-3 transition-all hover:bg-gray-50"
            >
              <Icon className="w-4 h-4" style={{ color: "#9ca3af" }} strokeWidth={2} />
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#6b7280" }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderTop: "1.5px solid rgba(0,0,0,0.07)" }}
        >
          <button className="flex items-center gap-2 transition-colors hover:opacity-70">
            <LogOut className="w-4 h-4" style={{ color: "#dc2626" }} strokeWidth={2} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626" }}>Sign Out</span>
          </button>
          <span style={{ fontSize: "0.6rem", color: "#d1d5db", letterSpacing: "0.04em" }}>
            PetTech PWA v2.4
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pwaDrawerSlide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0);     }
        }
        @keyframes pwaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main PWAShell ────────────────────────────────────────────────────────────
export function PWAShell({
  children,
  ctaLabel,
  ctaIcon: CtaIcon,
  ctaColor = "#2563EB",
  onCta,
  noCta = false,
}: {
  children: React.ReactNode;
  ctaLabel?: string;
  ctaIcon?: React.ElementType;
  ctaColor?: string;
  onCta?: () => void;
  noCta?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif", background: "#f8f9ff" }}>

      {/* ── Sticky Web Header ── */}
      <PWAHeader onHamburger={() => setDrawerOpen(true)} />

      {/* ── Scrollable Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        {children}
      </div>

      {/* ── Fixed Full-Width CTA ── */}
      {!noCta && ctaLabel && (
        <div
          className="flex-shrink-0 px-4 pt-3 pb-5"
          style={{
            background: "white",
            borderTop: "1.5px solid rgba(0,0,0,0.07)",
            boxShadow: "0 -8px 28px rgba(0,0,0,0.09)",
          }}
        >
          <button
            onClick={onCta}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl transition-all active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${ctaColor} 0%, ${ctaColor}dd 100%)`,
              fontSize: "0.95rem",
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.01em",
              boxShadow: `0 8px 28px ${ctaColor}44, 0 2px 8px ${ctaColor}22`,
            }}
          >
            {CtaIcon && <CtaIcon className="w-4.5 h-4.5" strokeWidth={2.5} />}
            {ctaLabel}
          </button>
        </div>
      )}

      {/* ── Hamburger Drawer ── */}
      {drawerOpen && <PWADrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}