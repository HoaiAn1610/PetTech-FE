import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from "@/context/TenantContext";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/auth";
import { LoginModal } from "@/features/landing/modals/LoginModal";
import { catalogService } from "@/api/services";
import {
  PawPrint, Star, MapPin, Clock, Phone, Mail, ChevronRight,
  Stethoscope, Scissors, Syringe, ShoppingBag, Home, Package,
  CalendarDays, Check, X, User, Menu, Heart, Shield, Zap,
  Facebook, Instagram, MessageCircle, ChevronDown, ArrowRight,
  BadgeCheck, UtensilsCrossed, Tag,
} from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { motion, AnimatePresence, Variants } from "motion/react";
import { resolveMinioUrl } from "@/utils/file";

const HERO_IMG  = "https://images.unsplash.com/photo-1758631279366-8e8aeaf94082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBjbGluaWMlMjB2ZXRlcmluYXJ5JTIwc2hvcCUyMG1vZGVybiUyMGludGVyaW9yfGVufDF8fHx8MTc3MjgxMTgwN3ww&ixlib=rb-4.1.0&q=80&w=1080";
const DOG_IMG   = "https://images.unsplash.com/photo-1765520516788-fff9ed277a2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGdvbGRlbiUyMHJldHJpZXZlciUyMHBldCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgxMTgxMHww&ixlib=rb-4.1.0&q=80&w=1080";
const CAT_IMG   = "https://images.unsplash.com/photo-1772013971666-8ce244031dd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBwbGF5aW5nJTIwa2l0dGVuJTIwY3V0ZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjgxMTgxMXww&ixlib=rb-4.1.0&q=80&w=1080";

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

// Motion Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleUpVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// ─── Booking Modal ────────────────────────────────────────────────────────────
function QuickBookModal({ onClose, services, tenantName, primaryColor }: { onClose: () => void, services: any[], tenantName: string, primaryColor: string }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  let dashboardRoute = "/petowner";
  if (user && user.role !== Role.PetOwner) {
    dashboardRoute = "/clinic";
  }
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", fontFamily: "Inter, sans-serif" }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100%", opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div>
            <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>Đặt lịch nhanh 📅</p>
            <p style={{ fontSize: "0.72rem", color: "#9ca3af" }}>{tenantName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200" style={{ background: "#f3f4f6" }}>
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
                className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }} />
            </div>
          ))}
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", marginBottom: "6px" }}>Dịch vụ cần</p>
            <select className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
              style={{ border: "1.5px solid #e5e7eb", fontSize: "0.85rem", fontFamily: "Inter, sans-serif" }}>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onClose(); navigate("/petowner/booking"); }}
            className="w-full py-3.5 rounded-2xl mt-1"
            style={{ background: primaryColor, color: "white", fontWeight: 700, fontSize: "0.9rem", boxShadow: `0 4px 14px ${primaryColor}40` }}>
            Gửi yêu cầu đặt lịch →
          </motion.button>
          <p style={{ fontSize: "0.68rem", color: "#9ca3af", textAlign: "center" }}>
            Hoặc <button onClick={() => { onClose(); navigate(isAuthenticated ? dashboardRoute : "/auth/login"); }} style={{ color: primaryColor, fontWeight: 700 }}>đăng nhập vào tài khoản PetTech</button> để đặt lịch trực tuyến đầy đủ
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicShopPage() {
  const navigate  = useNavigate();
  const { tenant, settings } = useTenant();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [showBook, setShowBook]   = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeService, setActiveService] = useState<number | null>(null);

  const { data: servicesRes, isLoading: loadingServices } = useQuery({
    queryKey: ['public-services'],
    queryFn: () => catalogService.getServices(),
  });
  
  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ['public-products'],
    queryFn: () => catalogService.getProducts(),
  });

  const extractArray = (res: any) => Array.isArray(res) ? res : (res?.items || res?.data?.items || res?.data || res?.value || []);
  const services = extractArray(servicesRes);
  const products = extractArray(productsRes);
  
  const primaryColor = settings?.primaryColor || "#2563EB";
  const shopName = settings?.customShopName || tenant?.name || "Paws & Claws";
  const shopAddress = tenant?.address || "Đang cập nhật địa chỉ";
  const businessHours = `${settings?.businessHoursStart?.substring(0,5) || '08:00'} - ${settings?.businessHoursEnd?.substring(0,5) || '18:00'}`;

  let dashboardRoute = "/petowner";
  if (user && user.role !== Role.PetOwner) {
    dashboardRoute = "/clinic";
  }

  const NAV_LINKS = [
    { label: "Dịch vụ",    href: "#services"  },
    { label: "Cửa hàng",  href: "#shop"      },
    ...(settings?.showTeamSection !== false ? [{ label: "Đội ngũ",   href: "#our-team"  }] : []),
    ...(settings?.showReviewsSection !== false ? [{ label: "Đánh giá",  href: "#reviews"   }] : []),
    { label: "Liên hệ",   href: "#contact"   },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "white", minHeight: "100vh" }}>

      {/* ── Sticky Navbar ── */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-2.5">
          {settings?.customLogoUrl ? (
            <img src={resolveMinioUrl(settings.customLogoUrl)} alt={shopName} className="w-9 h-9 rounded-xl object-contain bg-slate-50 border p-0.5" style={{ borderColor: 'rgba(0,0,0,0.04)' }} />
          ) : tenant?.logoUrl ? (
            <img src={resolveMinioUrl(tenant.logoUrl)} alt={shopName} className="w-9 h-9 rounded-xl object-contain bg-slate-50 border p-0.5" style={{ borderColor: 'rgba(0,0,0,0.04)' }} />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: primaryColor }}>
              <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
          )}
          <div>
            <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>{shopName}</p>
            <p style={{ fontSize: "0.58rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>Phòng khám & Cửa hàng thú cưng</p>
          </div>
        </div>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(n => (
            <a key={n.label} href={n.href}
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}
              className="hover:text-blue-600 transition-colors relative group">
              {n.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Link to={dashboardRoute}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", textDecoration: "none" }}>
              <User className="w-4 h-4" /> Tài khoản của tôi
            </Link>
          ) : (
            <button onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: primaryColor, fontSize: "0.85rem", fontWeight: 700, color: "white", boxShadow: `0 4px 12px ${primaryColor}40`, border: "none", cursor: "pointer" }}>
              <User className="w-4 h-4" /> Đăng nhập
            </button>
          )}
          <button onClick={() => setMenuOpen(v => !v)} className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden" 
            style={{ background: "white", borderBottom: "1px solid #f3f4f6" }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map(n => (
                <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)}
                  className="py-2" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", textDecoration: "none" }}>{n.label}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "560px" }}>
        <motion.div 
          initial={{ scale: 1.05 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <ImageWithFallback src={resolveMinioUrl(settings?.bannerUrl) || resolveMinioUrl(settings?.customLogoUrl) || resolveMinioUrl(tenant?.logoUrl) || HERO_IMG} alt={shopName}
            className="w-full h-full object-cover" style={{ filter: "brightness(0.45)" }} />
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-start justify-center px-6 sm:px-16 py-20">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            animate="visible"
            className="w-full max-w-4xl"
          >
            {/* Badge */}
            <motion.div variants={fadeUpVariant} className="flex items-center gap-2 px-4 py-2 rounded-full mb-5 self-start"
              style={{ background: "rgba(249,115,22,0.9)", backdropFilter: "blur(8px)", display: "inline-flex" }}>
              <BadgeCheck className="w-4 h-4 text-white" />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "white" }}>Được tin tưởng bởi 2.400+ gia đình nuôi thú cưng</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.2, maxWidth: "640px" }}>
              {settings?.heroTitle ? (
                settings.heroTitle
              ) : (
                <>
                  Chăm sóc thú cưng toàn diện,<br />
                  <span style={{ color: "#fbbf24" }}>Tất cả dưới một mái nhà.</span>
                </>
              )}
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-white/70 mt-5" style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px" }}>
              {settings?.heroSubtitle || "Khám thú y, tắm gội chuyên nghiệp, tiêm phòng, gửi thú cưng và cửa hàng thú cưng đầy đủ — cho chó, mèo và nhiều hơn nữa."}
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3 mt-8">
              {settings?.acceptOnlineBookings !== false && (
                <button onClick={() => setShowBook(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ background: primaryColor, color: "white", fontWeight: 700, fontSize: "0.95rem", boxShadow: `0 8px 24px ${primaryColor}60` }}>
                  <CalendarDays className="w-5 h-5" /> Đặt lịch khám
                </button>
              )}
              <Link to="/petowner/shop"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.3)", color: "white", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", backdropFilter: "blur(8px)" }}>
                <ShoppingBag className="w-5 h-5" /> Ghé cửa hàng thú cưng
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-6 mt-12">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Info strip ── */}
      <div style={{ background: "#111827" }}>
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-between gap-4 px-6 py-4">
          {[
            { icon: MapPin,  text: shopAddress },
            { icon: Clock,   text: `Giờ mở cửa: ${businessHours}` },
            { icon: Phone,   text: tenant?.phone || "+84 28 1234 5678" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "#60a5fa" }} />
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <section id="services" className="py-20 px-6" style={{ background: "#f8fafc" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>CHÚNG TÔI CUNG CẤP</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Dịch vụ của chúng tôi</h2>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "8px", lineHeight: 1.7 }}>Chăm sóc toàn diện cho thú cưng yêu quý của bạn ở mọi giai đoạn của cuộc đời.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
          >
            {loadingServices ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl p-6 flex flex-col gap-4 animate-pulse" style={{ background: "white", border: "1.5px solid #f0f1f3" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-50 rounded mt-2"></div>
                </div>
              ))
            ) : services.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center py-10">
                <p className="text-gray-500 text-sm">Cửa hàng chưa có dịch vụ nào.</p>
              </div>
            ) : (
              services.map((s: any, i: number) => {
                const sColor = s.colorCode || primaryColor;
                const sBg = `${sColor}15`;
                return (
                  <motion.div 
                    variants={fadeUpVariant}
                    whileHover={{ y: -5, scale: 1.02 }}
                    key={s.id || s.name}
                    className="rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-colors"
                    style={{
                      background: "white",
                      border: activeService === i ? `2px solid ${sColor}` : "1.5px solid #f0f1f3",
                      boxShadow: activeService === i ? `0 8px 24px ${sColor}20` : "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                    onClick={() => setActiveService(activeService === i ? null : i)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: sBg }}>{s.emoji || "🐾"}</div>
                      <div>
                        <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>{s.name}</p>
                        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: sColor, marginTop: "2px" }}>
                          {s.price ? s.price.toLocaleString("vi-VN") + "đ" : "Liên hệ"}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6 }} className="line-clamp-2">
                      {s.description || `Dịch vụ ${s.name} chuyên nghiệp dành cho thú cưng.`}
                    </p>
                    {settings?.acceptOnlineBookings !== false && (
                      <button onClick={e => { e.stopPropagation(); navigate(`/petowner/booking?serviceId=${s.id}`); }}
                        className="flex items-center gap-1.5 self-start px-4 py-2 rounded-xl transition-all hover:opacity-80"
                        style={{ background: sBg, fontSize: "0.75rem", fontWeight: 700, color: sColor }}>
                        Đặt lịch <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section id="shop" className="py-20 px-6" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>CỬA HÀNG THÚ CƯNG</p>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Sản phẩm nổi bật</h2>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: "6px" }}>Thức ăn, bánh thưởng, phụ kiện và sản phẩm sức khỏe cao cấp.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Link to="/petowner/shop"
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", fontSize: "0.78rem", fontWeight: 700, color: "#2563EB", textDecoration: "none" }}>
                Xem tất cả <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
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
              <motion.span 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={c.label} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors"
                style={{ background: i === 0 ? c.bg : "#f3f4f6", fontSize: "0.75rem", fontWeight: 700, color: i === 0 ? c.color : "#6b7280", cursor: "pointer" }}>
                {c.emoji} {c.label}
              </motion.span>
            ))}
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          >
            {loadingProducts ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl flex flex-col animate-pulse" style={{ background: "#f8fafc", border: "1.5px solid #f0f1f3" }}>
                  <div className="h-28 bg-gray-100"></div>
                  <div className="p-3">
                    <div className="h-2 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-2 sm:col-span-3 md:col-span-6 text-center py-10">
                <p className="text-gray-500 text-sm">Cửa hàng chưa có sản phẩm nào.</p>
              </div>
            ) : (
              products.map((p: any) => {
                const isOutOfStock = typeof p.isInStock === 'boolean' ? !p.isInStock : (p.stockQty !== undefined && p.stockQty <= 0);
                return (
                  <motion.div 
                    variants={scaleUpVariant}
                    whileHover={{ y: -5, scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}
                    key={p.id || p.name} 
                    className="rounded-2xl overflow-hidden flex flex-col"
                    style={{ background: "#f8fafc", border: "1.5px solid #f0f1f3", cursor: "pointer", opacity: isOutOfStock ? 0.6 : 1 }}
                    onClick={() => navigate(`/petowner/shop`)}>
                    <div className="flex items-center justify-center py-5 h-28 relative" style={{ background: "#eef2ff" }}>
                      {p.photoUrl ? (
                        <ImageWithFallback src={resolveMinioUrl(p.photoUrl)} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <span className="text-4xl">{p.emoji || "🛍️"}</span>
                      )}
                      {isOutOfStock && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full"
                          style={{ background: "#ef4444", fontSize: "0.55rem", fontWeight: 800, color: "white" }}>Hết hàng</span>
                      )}
                    </div>
                    <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1 flex-1">
                      <p style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{p.categoryName || p.category || "Sản phẩm"}</p>
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#111827", lineHeight: 1.3 }} className="line-clamp-2">{p.name}</p>
                      <p className="mt-auto" style={{ fontSize: "0.82rem", fontWeight: 800, color: primaryColor, paddingTop: "4px" }}>
                        {p.price ? p.price.toLocaleString("vi-VN") + "đ" : "Liên hệ"}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          <div className="text-center mt-8">
            <Link to="/petowner/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg,#F97316,#ea580c)", color: "white", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>
              <ShoppingBag className="w-5 h-5" /> Mua tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why us ── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)" }} className="py-20 px-6 overflow-hidden">
        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-5xl mx-auto relative"
        >
          <motion.h2 variants={fadeUpVariant} className="text-white text-center" style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)", fontWeight: 900, marginBottom: "40px", letterSpacing: "-0.02em" }}>
            Tại sao chủ thú cưng chọn chúng tôi
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🏆", title: "8+ năm chăm sóc",               sub: "Được tin tưởng bởi hàng nghìn gia đình"         },
              { emoji: "🩺", title: "Bác sĩ có chứng chỉ",            sub: "Chuyên môn cao cho mọi bệnh lý"                },
              { emoji: "📱", title: "Đặt lịch & hồ sơ trực tuyến",   sub: "Quản lý mọi thứ trong ứng dụng PetTech"       },
              { emoji: "🛍️", title: "Cửa hàng thú cưng đầy đủ",       sub: "Thương hiệu cao cấp, giá tốt nhất"            },
            ].map((w, index) => (
              <motion.div 
                variants={fadeUpVariant}
                whileHover={{ y: -8, scale: 1.05 }}
                key={w.title} className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-4xl">{w.emoji}</span>
                <p className="text-white" style={{ fontSize: "0.9rem", fontWeight: 800 }}>{w.title}</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.7)" }}>{w.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Team ── */}
      {settings?.showTeamSection !== false && (
        <section id="our-team" className="py-20 px-6" style={{ background: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase" }}>GẶP GỠ ĐỘI NGŨ</p>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Đội ngũ chuyên gia của chúng tôi</h2>
            </motion.div>
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-5"
            >
              {TEAM.map(t => (
                <motion.div 
                  variants={fadeUpVariant}
                  whileHover={{ y: -10 }}
                  key={t.name} className="rounded-2xl overflow-hidden text-center"
                  style={{ background: "white", border: "1.5px solid #f0f1f3", boxShadow: "0 4px 14px rgba(0,0,0,0.03)" }}>
                  <div className="py-8 text-5xl" style={{ background: "linear-gradient(135deg,#f0f9ff,#eff6ff)" }}>{t.emoji}</div>
                  <div className="px-4 py-5">
                    <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{t.name}</p>
                    <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#2563EB", marginTop: "2px" }}>{t.role}</p>
                    <p style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: "6px" }}>{t.specialty}</p>
                    <div className="flex items-center justify-center gap-1 mt-4">
                      <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>{t.rating}</span>
                      <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>· {t.exp}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      {settings?.showReviewsSection !== false && (
        <section id="reviews" className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.1em", textTransform: "uppercase" }}>ĐÁNH GIÁ</p>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 900, color: "#111827", marginTop: "8px", letterSpacing: "-0.02em" }}>Chủ thú cưng nói gì về chúng tôi</h2>
              <div className="flex items-center justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "#111827" }}>4,9</span>
                <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>· 312 đánh giá trên Google</span>
              </div>
            </motion.div>
            <motion.div 
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {REVIEWS.map(r => (
                <motion.div 
                  variants={fadeUpVariant}
                  whileHover={{ scale: 1.02 }}
                  key={r.name} className="rounded-3xl p-8 flex flex-col gap-4 relative"
                  style={{ background: "#f8fafc", border: "1.5px solid #f0f1f3" }}>
                  <div className="absolute top-6 right-6 text-4xl opacity-10">❞</div>
                  <div className="flex items-center gap-1 z-10">
                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4" style={{ color: "#f59e0b", fill: "#f59e0b" }} />)}
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.8, fontStyle: "italic", zIndex: 10 }}>"{r.text}"</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 z-10">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg,#2563EB,#7c3aed)", fontSize: "0.85rem", fontWeight: 700 }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>{r.name}</p>
                      <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "2px" }}>Chủ của {r.pet} · {r.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4 }}
          className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6"
        >
          <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl origin-bottom">🐾</motion.span>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
            Sẵn sàng mang đến sự chăm sóc tốt nhất cho thú cưng?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.7 }}>
            Đặt lịch khám, ghé cửa hàng thú cưng hoặc đăng nhập vào tài khoản PetTech để quản lý hồ sơ sức khỏe, lịch hẹn và nhiều hơn nữa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {settings?.acceptOnlineBookings !== false && (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowBook(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl"
                style={{ background: primaryColor, color: "white", fontWeight: 700, fontSize: "0.95rem", boxShadow: `0 8px 24px ${primaryColor}40` }}>
                <CalendarDays className="w-5 h-5" /> Đặt lịch khám
              </motion.button>
            )}
            {isAuthenticated ? (
              <Link to={dashboardRoute}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl transition-all hover:bg-gray-50"
                style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                <PawPrint className="w-5 h-5" /> Truy cập hệ thống
              </Link>
            ) : (
              <button onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl transition-all hover:bg-gray-50"
                style={{ background: "white", border: "2px solid #e5e7eb", color: "#374151", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
                <PawPrint className="w-5 h-5" /> Đăng nhập PetTech
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="px-6 py-12" style={{ background: "#111827" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              {settings?.customLogoUrl ? (
                <img src={resolveMinioUrl(settings.customLogoUrl)} alt={shopName} className="w-10 h-10 rounded-xl object-contain bg-slate-50 border p-0.5" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              ) : tenant?.logoUrl ? (
                <img src={resolveMinioUrl(tenant.logoUrl)} alt={shopName} className="w-10 h-10 rounded-xl object-contain bg-slate-50 border p-0.5" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: primaryColor }}>
                  <PawPrint className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              )}
              <div>
                <p className="text-white" style={{ fontSize: "1rem", fontWeight: 800 }}>{shopName}</p>
                <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Ngôi nhà thứ hai của thú cưng bạn</p>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              Phục vụ các gia đình nuôi thú cưng tại TP. Hồ Chí Minh từ năm 2018. Vận hành bởi <span style={{ color: "#60a5fa" }}>PetTech</span>.
            </p>

            {/* Social Links */}
            {(settings?.facebookUrl || settings?.instagramUrl || settings?.zaloPhone) && (
              <div className="flex items-center gap-3 mt-5">
                {settings?.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110" title="Facebook">
                    <Facebook className="w-4 h-4 text-white" />
                  </a>
                )}
                {settings?.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110" title="Instagram">
                    <Instagram className="w-4 h-4 text-white" />
                  </a>
                )}
                {settings?.zaloPhone && (
                  <a href={`https://zalo.me/${settings.zaloPhone.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:scale-110" title="Zalo">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </a>
                )}
              </div>
            )}
          </div>
          {/* Contact */}
          <div>
            <p className="text-white" style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "20px" }}>Liên hệ chúng tôi</p>
            <div className="flex flex-col gap-4">
              {[
                { icon: MapPin, text: shopAddress },
                { icon: Phone,  text: tenant?.phone || "+84 28 1234 5678" },
                { icon: Mail,   text: tenant?.email || "hello@pawsandclaws.vn" },
                { icon: Clock,  text: `Giờ mở cửa: ${businessHours}` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#60a5fa" }} />
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* PetTech CTA */}
          <div>
            <p className="text-white" style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "16px" }}>Quản lý chăm sóc thú cưng</p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "16px" }}>
              Đặt lịch trực tuyến, xem hồ sơ, mua sắm và tích điểm thưởng — tất cả trong ứng dụng PetTech dành cho chủ thú cưng.
            </p>
            <Link to="/petowner"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:bg-blue-600/30"
              style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)", fontSize: "0.8rem", fontWeight: 700, color: "#60a5fa", textDecoration: "none" }}>
              <PawPrint className="w-4 h-4" /> Mở cổng PetTech
            </Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} {shopName}. Vận hành bởi PetTech SaaS.</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Làm với ❤️ cho thú cưng</p>
        </div>
      </footer>

      <AnimatePresence>
        {showBook && <QuickBookModal onClose={() => setShowBook(false)} services={services} tenantName={shopName} primaryColor={primaryColor} />}
      </AnimatePresence>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSwitchToRegister={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
