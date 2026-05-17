import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  PawPrint, Star, MapPin, Clock, Phone, Mail, ChevronRight,
  Stethoscope, Scissors, Syringe, ShoppingBag, Home, Package,
  CalendarDays, Check, X, User, Menu, Heart, Shield, Zap,
  Facebook, Instagram, MessageCircle, ChevronDown, ArrowRight,
  BadgeCheck, UtensilsCrossed, Tag,
} from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

const HERO_IMG  = "https://images.unsplash.com/photo-1758631279366-8e8aeaf94082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBjbGluaWMlMjB2ZXRlcmluYXJ5JTIwc2hvcCUyMG1vZGVybiUyMGludGVyaW9yfGVufDF8fHx8MTc3MjgxMTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080";
const DOG_IMG   = "https://images.unsplash.com/photo-1765520516788-fff9ed277a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGdvbGRlbiUyMHJldHJpZXZlciUyMHBldCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgxMTgxMHww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_IMG   = "https://images.unsplash.com/photo-1772013971666-8ce244031dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBwbGF5aW5nJTIwa2l0dGVuJTIwY3V0ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgxMTgxMXww&ixlib=rb-4.1.0&q=80&w=1080";

const SERVICES = [
  { icon: Stethoscope, label: "Khám thú y",          desc: "Khám tổng quát, chẩn đoán và điều trị cho mọi loại thú cưng. Cấp cứu 6 ngày mỗi tuần.",                 price: "Từ 85.000đ",   color: "#2563EB", bg: "rgba(37,99,235,0.06)",  emoji: "🩺" },
  { icon: Scissors,    label: "Tắm & cắt tỉa lông",  desc: "Cắt tỉa, tắm gội, cắt móng, vệ sinh tai bởi chuyên gia tạo kiểu lông được chứng nhận.",                   price: "Từ 55.000đ",   color: "#7c3aed", bg: "rgba(124,58,237,0.06)", emoji: "✂️" },
  { icon: Syringe,     label: "Tiêm phòng",           desc: "Vaccine cốt lõi & lối sống cho chó mèo. Chúng tôi lưu toàn bộ lịch sử tiêm phòng của thú cưng.",          price: "Từ 35.000đ",   color: "#16a34a", bg: "rgba(22,163,74,0.06)",  emoji: "💉" },
  { icon: Home,        label: "Gửi thú cưng",         desc: "Chăm sóc qua đêm an toàn, có giám sát trong môi trường thoải mái. Vui chơi và ăn uống hàng ngày.",        price: "45.000đ/đêm", color: "#F97316", bg: "rgba(249,115,22,0.06)", emoji: "🏠" },
  { icon: ShoppingBag, label: "Cửa hàng thú cưng",    desc: "Thức ăn, bánh thưởng, phụ kiện và sản phẩm sức khỏe cao cấp cho thú cưng. Mua trực tuyến hoặc tại cửa hàng.", price: "Mua ngay",    color: "#0891b2", bg: "rgba(8,145,178,0.06)",  emoji: "🛍️" },
  { icon: Package,     label: "Chăm sóc răng miệng",  desc: "Làm sạch răng chuyên nghiệp, đánh bóng và đánh giá sức khỏe răng miệng cho nụ cười khỏe mạnh.",          price: "Từ 95.000đ",   color: "#dc2626", bg: "rgba(220,38,38,0.06)",  emoji: "🦷" },
];

const FEATURED_PRODUCTS = [
  { emoji: "🐶", name: "Royal Canin Adult 15kg",   category: "Thức ăn thú cưng", price: 480000, rating: 4.8, badge: "Bán chạy nhất" },
  { emoji: "🍗", name: "Bánh thưởng Temptations",  category: "Bánh thưởng",      price: 85000,  rating: 4.9, badge: "Đánh giá cao"  },
  { emoji: "🎾", name: "Đồ chơi Kong Classic",     category: "Đồ chơi",          price: 150000, rating: 4.9, badge: "Bán chạy nhất" },
  { emoji: "🦷", name: "Dentastix Daily Chews",    category: "Bánh thưởng",      price: 140000, rating: 4.5, badge: null            },
  { emoji: "💊", name: "Bổ sung Omega-3",          category: "Sức khỏe",         price: 240000, rating: 4.6, badge: null            },
  { emoji: "🏷️", name: "Vòng cổ da cho chó",      category: "Phụ kiện",         price: 220000, rating: 4.5, badge: "Mới"           },
];

const TEAM = [
  { name: "BS. Nguyễn Thị Lan", role: "Bác sĩ trưởng",       emoji: "👩‍⚕️", exp: "12 năm kinh nghiệm", rating: 4.9, specialty: "Nội khoa & Phẫu thuật"        },
  { name: "BS. Trần Văn Minh",  role: "Bác sĩ & Phẫu thuật", emoji: "👨‍⚕️", exp: "8 năm kinh nghiệm",  rating: 4.8, specialty: "Da liễu & Chỉnh hình"          },
  { name: "CN. Lê Thu Hà",      role: "Chuyên gia tạo kiểu",  emoji: "💇‍♀️", exp: "10 năm kinh nghiệm", rating: 4.9, specialty: "Tạo kiểu lông Châu Á & Âu"     },
  { name: "CN. Phạm Thị Yến",   role: "Kỹ thuật viên thú y", emoji: "🧑‍⚕️", exp: "5 năm kinh nghiệm",  rating: 4.7, specialty: "Xét nghiệm & Gây mê"            },
];

const REVIEWS = [
  { name: "Chị Lan N.", pet: "Golden Retriever", rating: 5, text: "Buddy rất thích đến đây! BS. Lan rất tận tâm và kỹ lưỡng. Đội ngũ tắm gội cũng tuyệt vời.", date: "Tháng 2/2026" },
  { name: "Anh Tuấn K.", pet: "Mèo Vàng",       rating: 5, text: "Tiêm phòng cho Mochi nhanh và không gây stress. Nhân viên rất nhẹ nhàng với mèo nhút nhát. Rất khuyến nghị!", date: "Tháng 1/2026" },
  { name: "Chị Mai P.", pet: "Poodle",           rating: 5, text: "Tiệm cắt tỉa tốt nhất trong vùng! Coco luôn ra ngoài đẹp như chó triển lãm. Giá cửa hàng cũng rất tốt.", date: "Tháng 12/2025" },
];

// ─── Booking Modal ────────────────────────────────────────────────────────────
function QuickBookModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div>
            <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đặt lịch nhanh 📅</p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>Phòng khám Paws & Claws</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <X className="w-4 h-4" style={{ color: "#374151" }} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { label: "Họ và tên",       placeholder: "VD: Nguyễn Thị Lan",     type: "text" },
            { label: "Số điện thoại",   placeholder: "VD: 0901 234 567",        type: "tel"  },
            { label: "Tên thú cưng",    placeholder: "VD: Buddy",               type: "text" },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>{f.label}</p>
              <input type={f.type} placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }} />
            </div>
          ))}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Dịch vụ cần</p>
            <select className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
              {SERVICES.map(s => <option key={s.label}>{s.label}</option>)}
            </select>
          </div>
          <button onClick={() => { onClose(); navigate("/petowner/booking"); }}
            className="w-full py-3.5 rounded-2xl mt-1"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
            Gửi yêu cầu đặt lịch →
          </button>
          <p style={{ fontSize: "0.68rem", color: "#9ca3af", textAlign: "center" }}>
            Hoặc <button onClick={() => { onClose(); navigate("/petowner"); }} style={{ color: "#2563EB", fontWeight: 700 }}>đăng nhập vào tài khoản PetTech</button> để đặt lịch trực tuyến đầy đủ
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicShopPage() {
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [showBook, setShowBook]   = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);

  const NAV_LINKS = [
    { label: "Dịch vụ",    href: "#services"  },
    { label: "Cửa hàng",  href: "#shop"      },
    { label: "Đội ngũ",   href: "#our-team"  },
    { label: "Đánh giá",  href: "#reviews"   },
    { label: "Liên hệ",   href: "#contact"   },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "white", minHeight: "100vh" }}>

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
            <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>Paws & Claws</p>
            <p style={{ fontSize: "0.58rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>Phòng khám & Cửa hàng thú cưng</p>
          </div>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.href}
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}
              className="hover:text-blue-600 transition-colors">{n.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/petowner"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl"
            style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", textDecoration: "none" }}>
            <User className="w-4 h-4" /> Tài khoản của tôi
          </Link>
          <button onClick={() => setShowBook(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl"
            style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", fontSize: "0.78rem", fontWeight: 700, color: "white" }}>
            <CalendarDays className="w-4 h-4" /> Đặt lịch ngay
          </button>
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-3" style={{ background: "white", borderBottom: "1px solid #f3f4f6" }}>
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)}
              className="py-2" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}>{n.label}</a>
          ))}
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>
        <ImageWithFallback src={HERO_IMG} alt="Paws & Claws Clinic"
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.45)" }} />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-16 py-20">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full mb-5"
            style={{ background: "rgba(249,115,22,0.9)", backdropFilter: "blur(8px)" }}>
            <BadgeCheck className="w-4 h-4 text-white" />
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "white" }}>Được tin tưởng bởi 2.400+ gia đình nuôi thú cưng</span>
          </div>
          <h1 className="text-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "640px" }}>
            Chăm sóc thú cưng toàn diện,<br />
            <span style={{ color: "#fbbf24" }}>Tất cả dưới một mái nhà.</span>
          </h1>
          <p className="text-white/70 mt-5" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px" }}>
            Khám thú y, tắm gội chuyên nghiệp, tiêm phòng, gửi thú cưng và cửa hàng thú cưng đầy đủ — cho chó, mèo và nhiều hơn nữa.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button onClick={() => setShowBook(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
              <CalendarDays className="w-5 h-5" /> Đặt lịch khám
            </button>
            <Link to="/petowner/shop"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", backdropFilter: "blur(8px)" }}>
              <ShoppingBag className="w-5 h-5" /> Ghé cửa hàng thú cưng
            </Link>
          </div>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-10">
            {[
              { label: "Năm hoạt động",          value: "8+" },
              { label: "Thú cưng được phục vụ",  value: "12.000+" },
              { label: "Đánh giá Google",         value: "4,9 ⭐" },
              { label: "Mở cửa 6 ngày/tuần",     value: "T2–T7" },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <p className="text-white" style={{ fontSize: "1.2rem", fontWeight: 900 }}>{s.value}</p>
                <p className="text-white/50" style={{ fontSize: "0.65rem" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Info strip ── */}
      <div style={{ background: "#111827" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-between gap-4 px-6 py-4">
          {[
            { icon: MapPin,  text: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" },
            { icon: Clock,   text: "T2–T7: 8:00 – 18:00 · CN: Nghỉ" },
            { icon: Phone,   text: "+84 28 1234 5678 · Hỗ trợ qua Zalo" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#60a5fa" }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section id="services" className="py-16 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>CHÚNG TÔI CUNG CẤP</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Dịch vụ của chúng tôi</h2>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "8px", lineHeight: 1.7 }}>Chăm sóc toàn diện cho thú cưng yêu quý của bạn ở mọi giai đoạn của cuộc đời.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label}
                  className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all hover:-translate-y-1"
                  style={{
                    background: "white",
                    border: activeService === i ? `2px solid ${s.color}` : "1.5px solid #f0f1f3",
                    boxShadow: activeService === i ? `0 8px 24px ${s.color}20` : "0 2px 12px rgba(0,0,0,0.04)",
                  }}
                  onClick={() => setActiveService(activeService === i ? null : i)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: s.bg }}>{s.emoji}</div>
                    <div>
                      <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{s.label}</p>
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: s.color, marginTop: "2px" }}>{s.price}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</p>
                  <button onClick={e => { e.stopPropagation(); setShowBook(true); }}
                    className="flex items-center gap-1.5 self-start px-4 py-2 rounded-xl transition-all"
                    style={{ background: s.bg, fontSize: "0.75rem", fontWeight: 700, color: s.color }}>
                    Đặt lịch <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section id="shop" className="py-16 px-6" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>CỬA HÀNG THÚ CƯNG</p>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Sản phẩm nổi bật</h2>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "6px" }}>Thức ăn, bánh thưởng, phụ kiện và sản phẩm sức khỏe cao cấp.</p>
            </div>
            <Link to="/petowner/shop"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", textDecoration: "none" }}>
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: "Tất cả sản phẩm",  emoji: "🏪", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
              { label: "Thức ăn thú cưng", emoji: "🥗", color: "#d97706", bg: "rgba(217,119,6,0.08)"  },
              { label: "Bánh thưởng & Pate",emoji: "🍗", color: "#0891b2", bg: "rgba(8,145,178,0.08)"  },
              { label: "Phụ kiện",          emoji: "🏷️", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
              { label: "Sức khỏe",          emoji: "💊", color: "#16a34a", bg: "rgba(22,163,74,0.08)"  },
            ].map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
                style={{ background: i === 0 ? c.bg : "#f3f4f6", fontSize: "0.75rem", fontWeight: 700, color: i === 0 ? c.color : "#6b7280", cursor: "pointer" }}>
                {c.emoji} {c.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {FEATURED_PRODUCTS.map(p => (
              <div key={p.name} className="rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
                style={{ background: "#f8fafc", border: "1.5px solid #f0f1f3", cursor: "pointer" }}
                onClick={() => navigate("/petowner/shop")}>
                <div className="flex items-center justify-center py-5 text-4xl relative" style={{ background: "#eef2ff" }}>
                  {p.emoji}
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                      style={{ background: "#F97316", fontSize: "0.55rem", fontWeight: 800, color: "white" }}>{p.badge}</span>
                  )}
                </div>
                <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1">
                  <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{p.category}</p>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#374151" }}>{p.rating}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 800, color: "#111827", marginTop: "4px" }}>{p.price.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/petowner/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl"
              style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              <ShoppingBag className="w-5 h-5" /> Mua tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)" }} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white text-center" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 900, marginBottom: "40px", letterSpacing: "-0.02em" }}>
            Tại sao chủ thú cưng chọn chúng tôi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🏆", title: "8+ năm chăm sóc",               sub: "Được tin tưởng bởi hàng nghìn gia đình"         },
              { emoji: "🩺", title: "Bác sĩ có chứng chỉ",            sub: "Chuyên môn cao cho mọi bệnh lý"                },
              { emoji: "📱", title: "Đặt lịch & hồ sơ trực tuyến",   sub: "Quản lý mọi thứ trong ứng dụng PetTech"       },
              { emoji: "🛍️", title: "Cửa hàng thú cưng đầy đủ",       sub: "Thương hiệu cao cấp, giá tốt nhất"            },
            ].map(w => (
              <div key={w.title} className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <span className="text-3xl">{w.emoji}</span>
                <p className="text-white" style={{ fontSize: "0.88rem", fontWeight: 800 }}>{w.title}</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>{w.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Team ── */}
      <section id="our-team" className="py-16 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase" }}>GẶP GỠ ĐỘI NGŨ</p>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Đội ngũ chuyên gia của chúng tôi</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {TEAM.map(t => (
              <div key={t.name} className="rounded-2xl overflow-hidden text-center"
                style={{ background: "white", border: "1.5px solid #f0f1f3" }}>
                <div className="py-8 text-5xl" style={{ background: "linear-gradient(135deg,#f0f9ff,#eff6ff)" }}>{t.emoji}</div>
                <div className="px-4 py-4">
                  <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{t.name}</p>
                  <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#2563EB", marginTop: "2px" }}>{t.role}</p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "4px" }}>{t.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mt-3">
                    <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>{t.rating}</span>
                    <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>· {t.exp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>ĐÁNH GIÁ</p>
            <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Chủ thú cưng nói gì về chúng tôi</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
              <span style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>4,9</span>
              <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>· 312 đánh giá trên Google</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map(r => (
              <div key={r.name} className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: "#f8fafc", border: "1.5px solid #f0f1f3" }}>
                <div className="flex items-center gap-1">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>"{r.text}"</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)", fontSize: "0.75rem", fontWeight: 700 }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#111827" }}>{r.name}</p>
                    <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Chủ của {r.pet} · {r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)" }}>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="text-5xl">🐾</span>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
            Sẵn sàng mang đến sự chăm sóc tốt nhất cho thú cưng?
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: 1.7 }}>
            Đặt lịch khám, ghé cửa hàng thú cưng hoặc đăng nhập vào tài khoản PetTech để quản lý hồ sơ sức khỏe, lịch hẹn và nhiều hơn nữa.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setShowBook(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 6px 20px rgba(37,99,235,0.3)" }}>
              <CalendarDays className="w-5 h-5" /> Đặt lịch khám
            </button>
            <Link to="/petowner"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl"
              style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              <PawPrint className="w-5 h-5" /> Đăng nhập PetTech
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="px-6 py-10" style={{ background: "#111827" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)" }}>
                <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: "0.95rem", fontWeight: 800 }}>Phòng khám Paws & Claws</p>
                <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>Ngôi nhà thứ hai của thú cưng bạn</p>
              </div>
            </div>
            <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Phục vụ các gia đình nuôi thú cưng tại TP. Hồ Chí Minh từ năm 2018. Vận hành bởi <span style={{ color: "#60a5fa" }}>PetTech</span>.
            </p>
          </div>
          {/* Contact */}
          <div>
            <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "16px" }}>Liên hệ chúng tôi</p>
            <div className="flex flex-col gap-3">
              {[
                { icon: MapPin, text: "123 Nguyễn Huệ, Quận 1" },
                { icon: Phone,  text: "+84 28 1234 5678" },
                { icon: Mail,   text: "hello@pawsandclaws.vn" },
                { icon: Clock,  text: "T2–T7: 8:00 – 18:00" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#60a5fa" }} />
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* PetTech CTA */}
          <div>
            <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "12px" }}>Quản lý chăm sóc thú cưng</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "14px" }}>
              Đặt lịch trực tuyến, xem hồ sơ, mua sắm và tích điểm thưởng — tất cả trong ứng dụng PetTech dành cho chủ thú cưng.
            </p>
            <Link to="/petowner"
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)", fontSize: "0.78rem", fontWeight: 700, color: "#60a5fa", textDecoration: "none" }}>
              <PawPrint className="w-4 h-4" /> Mở cổng PetTech
            </Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>© 2026 Phòng khám Paws & Claws. Vận hành bởi PetTech SaaS.</p>
          <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Làm với ❤️ cho thú cưng</p>
        </div>
      </footer>

      {showBook && <QuickBookModal onClose={() => setShowBook(false)} />}
    </div>
  );
}


