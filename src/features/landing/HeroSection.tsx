import { ArrowRight, PlayCircle, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { motion, Variants } from "motion/react";

interface HeroSectionProps {
  heroImageUrl: string;
  onDemo?: () => void;
  onVideo?: () => void;
  onRegister?: () => void;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export function HeroSection({ heroImageUrl, onDemo, onVideo, onRegister }: HeroSectionProps) {
  const trustBadges = [
    "Tuân thủ HIPAA",
    "Chứng nhận ISO 27001",
    "SOC 2 Loại II",
  ];

  const socialProof = [
    { stat: "2.400+", label: "Cơ sở đang dùng" },
    { stat: "1,2 tr+", label: "Thú cưng" },
    { stat: "99,9%",  label: "Thời gian hoạt động" },
    { stat: "4,9★",   label: "Đánh giá" },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(160deg, #EFF6FF 0%, #F0F9FF 40%, #FFF7ED 100%)",
      }}
    >
      {/* Background Decorations */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #2563EB 0%, transparent 70%)",
          transform: "translate(30%, -20%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #F97316 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            className="flex flex-col gap-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Pill badge */}
            <motion.div variants={fadeUpVariant} className="flex">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
                style={{
                  background: "rgba(37,99,235,0.06)",
                  borderColor: "rgba(37,99,235,0.2)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#2563EB" }}
                />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2563EB", letterSpacing: "0.04em" }}>
                  🐾 NỀN TẢNG SaaS CHO PHÒNG KHÁM · SPA · PET SHOP
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUpVariant}>
              <h1
                className="text-gray-900"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                Vận hành dịch vụ
                <br />
                <span style={{ color: "#2563EB" }}>thú cưng hiện đại</span>
              </h1>
              <p
                className="mt-5 text-gray-500 max-w-lg"
                style={{ fontSize: "1.1rem", fontWeight: 400, lineHeight: 1.7 }}
              >
                Nền tảng quản lý all-in-one cho <strong style={{ color: "#111827" }}>Phòng khám thú y</strong>, <strong style={{ color: "#111827" }}>Pet Spa & Grooming</strong> và <strong style={{ color: "#111827" }}>Pet Shop</strong> — từ đặt lịch thông minh, thanh toán POS, quản lý kho hàng đến hồ sơ sức khỏe thú cưng và CRM khách hàng. Tất cả trên một nền tảng duy nhất.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 items-center">
              <button
                onClick={onRegister}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
                }}
              >
                Dùng thử miễn phí
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={onVideo}
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  border: "1.5px solid rgba(37,99,235,0.2)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1e40af",
                  backdropFilter: "blur(8px)",
                }}
              >
                <PlayCircle className="w-5 h-5" style={{ color: "#F97316" }} />
                Xem demo 2 phút
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#374151" }}>{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeUpVariant} className="flex gap-8 pt-2 border-t border-gray-200/80">
              {socialProof.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>
                    {item.stat}
                  </span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#6b7280" }}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main image card with floating effect */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: "100%",
                maxWidth: "580px",
                border: "1px solid rgba(255,255,255,0.8)",
              }}
            >
              {/* Browser chrome mock */}
              <div
                className="flex items-center gap-1.5 px-4 py-3"
                style={{ background: "#1e293b" }}
              >
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
                <div
                  className="ml-3 flex-1 rounded-md px-3 py-1 flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.08)", maxWidth: "200px" }}
                >
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>🔒 app.pettech.io</span>
                </div>
              </div>
              {/* Image */}
              <ImageWithFallback
                src={heroImageUrl}
                alt="PetTech Dashboard — Quản lý phòng khám, spa và pet shop thú cưng"
                className="w-full object-cover"
                style={{ height: "360px" }}
              />

              {/* Floating stats card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: [-5, 5, -5] }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                }}
                className="absolute top-20 -left-8 rounded-xl p-4 shadow-xl hidden lg:block"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  minWidth: "160px",
                }}
              >
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#6b7280", marginBottom: "4px" }}>
                  LỊCH HẸN HÔM NAY
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                  48
                </div>
                <div
                  className="mt-2 flex items-center gap-1"
                  style={{ fontSize: "0.75rem", fontWeight: 600, color: "#22c55e" }}
                >
                  ↑ 12% so với tuần trước
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: [5, -5, 5] }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  delay: 0.2,
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 } 
                }}
                className="absolute bottom-8 -right-6 rounded-xl p-3.5 shadow-xl hidden lg:flex items-center gap-3"
                style={{
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.06)",
                  minWidth: "200px",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <span style={{ fontSize: "1.1rem" }}>✂️</span>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827" }}>
                    Luna — Lịch grooming đã xác nhận
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                    Đã nhắc nhở qua SMS + Zalo
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative blob */}
            <div
              className="absolute -z-10 rounded-full opacity-30 hidden lg:block"
              style={{
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, #dbeafe 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-45%, -50%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
