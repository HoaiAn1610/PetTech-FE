import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { PetOwnerShell } from "@/components/petowner/PetOwnerShell";
import { useTenant } from "@/context/TenantContext";
import {
  CalendarDays, ShoppingBag, PawPrint, ClipboardList,
  Stethoscope, Scissors, Syringe, Star,
  Gift, AlertCircle, TrendingUp, ChevronRight,
  ArrowRight,
} from "lucide-react";
import { 
  HomeStatsCard, UpcomingApptCard, HomeActivityList 
} from "@/features/petowner/home/HomeComponents";

const UPCOMING_APPT = {
  date: "18 tháng 3, 2026", time: "14:00",
  service: "Tắm chải toàn bộ", pet: "Buddy",
  vet: "BS. Nguyễn Thị Lan", type: "Grooming",
};

const QUICK_ACTIONS = [
  { icon: CalendarDays, label: "Đặt lịch hẹn",      sub: "Đặt lịch khám thú y",      href: "/petowner/booking", color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
  { icon: ShoppingBag,  label: "Mua sắm",          sub: "Cửa hàng sản phẩm cao cấp", href: "/petowner/shop",    color: "#F97316", bg: "rgba(249,115,22,0.08)" },
  { icon: PawPrint,     label: "Thú cưng của tôi",   sub: "Quản lý hồ sơ & sức khỏe", href: "/petowner/pets",    color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { icon: ClipboardList,label: "Lịch sử khám",       sub: "Lần khám & đơn hàng trước", href: "/petowner/history", color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
];

const RECENT_ACTIVITY = [
  { id: "a1", icon: "💉", title: "Tiêm phòng — Buddy",     sub: "Đã tiêm nhắc vaccine DHPP",         date: "25/02", type: "visit"    },
  { id: "a2", icon: "📦", title: "Đơn hàng đã giao",        sub: "Royal Canin 15kg · $48.00",       date: "20/02", type: "purchase" },
  { id: "a3", icon: "✂️", title: "Cắt lông — Whiskers",     sub: "Cắt toàn bộ + Vệ sinh tai",      date: "12/02", type: "visit"    },
  { id: "a4", icon: "🩺", title: "Kiểm tra định kỳ",      sub: "Buddy · Tất cả chỉ số bình thường", date: "10/02", type: "visit"  },
  { id: "a5", icon: "🛒", title: "Mua hàng tại shop",       sub: "Temptations × 3 · $15.90",        date: "08/02", type: "purchase"},
];

const CLINIC_SERVICES = [
  { icon: Stethoscope, label: "Thú y tổng quát",   sub: "Từ $85",    color: "#2563EB", bg: "rgba(37,99,235,0.08)"  },
  { icon: Scissors,    label: "Chăm sóc & Cắt tỉa", sub: "Từ $55",    color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { icon: Syringe,     label: "Dịch vụ tiêm phòng", sub: "Từ $35",    color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
  { icon: ShoppingBag, label: "Phụ kiện & Thức ăn", sub: "Duyệt ngay", color: "#F97316", bg: "rgba(249,115,22,0.08)" },
];

const FEATURED_PRODUCTS = [
  { emoji: "🐶", name: "Royal Canin Adult 15kg", price: 48.00, rating: 4.8, badge: "Bán chạy" },
  { emoji: "🍗", name: "Temptations Treat Mix",  price: 8.50,  rating: 4.9, badge: "Top rated" },
  { emoji: "🎾", name: "Đồ chơi Kong Classic",     price: 15.00, rating: 4.9, badge: null      },
  { emoji: "🦷", name: "Xương gặm Dentastix",     price: 14.00, rating: 4.5, badge: null      },
];

export default function PetOwnerHomePage() {
  const navigate = useNavigate();
  const [loyaltyPoints] = useState(450);
  const { settings } = useTenant();

  const filteredQuickActions = QUICK_ACTIONS.filter(a => {
    if (a.href === "/petowner/booking" && settings.acceptOnlineBookings === false) {
      return false;
    }
    return true;
  });

  return (
    <PetOwnerShell pageTitle="Bảng điều khiển" cartCount={2}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8" style={{ fontFamily: "Inter, sans-serif" }}>

        {/* ── Welcome + Stats Row ── */}
        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
          {/* Welcome card */}
          <div
            className="col-span-2 rounded-[2.5rem] px-10 py-10 flex flex-col justify-between relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)", minHeight: "220px", boxShadow: "0 20px 50px rgba(37,99,235,0.2)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            <div className="relative z-10">
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 800, letterSpacing: "0.1em" }}>XIN CHÀO 👋</p>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 900, color: "white", marginTop: "6px", letterSpacing: "-0.04em" }}>Nguyễn Thị Lan</h1>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.75)", marginTop: "8px", fontWeight: 500 }}>
                Bạn có 2 thú cưng đang được chăm sóc tuyệt vời tại PetTech.
              </p>
            </div>
            <div className="flex items-center gap-10 relative z-10">
              {[
                { label: "Lượt khám", value: "12" },
                { label: "Thú cưng",   value: "2"  },
                { label: "Đã tiết kiệm", value: "$94" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: "1.8rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>{s.value}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <HomeStatsCard points={loyaltyPoints} />
          <UpcomingApptCard appt={UPCOMING_APPT} />
        </div>

        {/* ── Vaccine Alert ── */}
        {settings.acceptOnlineBookings && (
          <div className="flex items-center gap-5 px-8 py-5 rounded-[1.5rem] animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg shadow-orange-100"
            style={{ background: "rgba(249,115,22,0.06)", border: "1.5px solid rgba(249,115,22,0.15)" }}>
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 style={{ fontSize: "1rem", fontWeight: 900, color: "#92400e" }}>Sắp đến hạn tiêm phòng! 💉</h4>
              <p style={{ fontSize: "0.85rem", color: "#b45309", fontWeight: 500, marginTop: "2px" }}>
                Buddy cần tiêm nhắc vaccine <strong className="text-orange-700">DHPP</strong> vào ngày 25/03. Bạn nên đặt lịch sớm.
              </p>
            </div>
            <button onClick={() => navigate("/petowner/booking")}
              className="px-6 py-3 rounded-2xl flex-shrink-0 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-200"
              style={{ background: "#F97316", fontSize: "0.85rem", fontWeight: 900, color: "white" }}>
              Đặt lịch khám
            </button>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div>
          <p style={{ fontSize: "0.75rem", fontWeight: 900, color: "#94a3b8", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>Lối tắt nhanh</p>
          <div className="grid grid-cols-4 gap-6">
            {filteredQuickActions.map(a => {
              const Icon = a.icon;
              return (
                <Link key={a.label} to={a.href} style={{ textDecoration: "none" }}>
                  <div className="rounded-[2rem] p-6 flex flex-col gap-4 cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-white border border-gray-100 group shadow-sm">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 shadow-inner" style={{ background: a.bg }}>
                      <Icon className="w-7 h-7" style={{ color: a.color }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>{a.label}</h4>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px", fontWeight: 500, lineHeight: 1.4 }}>{a.sub}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-auto text-blue-600 font-black text-[0.7rem] uppercase tracking-widest group-hover:translate-x-2 transition-transform" style={{ color: a.color }}>
                      <span>Mở ngay</span>
                      <ArrowRight className="w-4 h-4" strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Row: Activity + Services + Products ── */}
        <div className="grid gap-8" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>

          <HomeActivityList activities={RECENT_ACTIVITY} />

          {/* Our Services */}
          <div className="rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Dịch vụ chuyên sâu</h4>
              <button onClick={() => navigate("/petowner/booking")} className="text-[0.75rem] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Khám phá →</button>
            </div>
            <div className="px-8 py-6 flex flex-col gap-4">
              {CLINIC_SERVICES.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-5 px-5 py-4 rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all border border-transparent hover:border-gray-100"
                    style={{ background: s.bg }}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                      <Icon className="w-5.5 h-5.5" style={{ color: s.color }} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1e293b" }}>{s.label}</p>
                      <p style={{ fontSize: "0.75rem", color: s.color, fontWeight: 700 }}>{s.sub}</p>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Products */}
          <div className="rounded-[2rem] bg-white overflow-hidden border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1e293b" }}>Sản phẩm nổi bật</h4>
              <button onClick={() => navigate("/petowner/shop")} className="text-[0.75rem] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Cửa hàng →</button>
            </div>
            <div className="px-8 py-6 flex flex-col gap-5 flex-1">
              {FEATURED_PRODUCTS.map(p => (
                <div key={p.name} className="flex items-center gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50 group-hover:scale-110 transition-transform shadow-inner">
                    {p.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate" style={{ fontSize: "0.9rem", fontWeight: 800, color: "#1e293b" }}>{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#475569" }}>{p.rating}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontSize: "1rem", fontWeight: 900, color: "#1e293b" }}>${p.price.toFixed(2)}</p>
                    {p.badge && (
                      <span className="text-[0.6rem] font-black text-orange-500 uppercase tracking-wider">
                        {p.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => navigate("/petowner/shop")}
                className="w-full py-4 rounded-2xl mt-auto transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-100"
                style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", color: "white", fontSize: "0.9rem", fontWeight: 900 }}>
                Mua sắm ngay
              </button>
            </div>
          </div>
        </div>

      </div>
    </PetOwnerShell>
  );
}
