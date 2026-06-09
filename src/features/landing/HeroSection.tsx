import { ArrowRight, PlayCircle } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { motion, Variants } from "motion/react";

interface HeroSectionProps {
  heroImageUrl: string;
  onVideo?: () => void;
  onRegister?: () => void;
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 18
    } 
  },
};

export function HeroSection({ heroImageUrl, onVideo, onRegister }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "radial-gradient(circle at 75% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 45%), radial-gradient(circle at 20% 70%, rgba(249, 115, 22, 0.06) 0%, transparent 40%), #ffffff",
      }}
    >
      {/* Decorative Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            className="lg:col-span-7 flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Pill badge */}
            <motion.div variants={fadeUpVariant} className="flex">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-100 bg-blue-50/50"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full animate-ping bg-blue-500"
                />
                <span className="text-[0.72rem] font-bold text-blue-600 tracking-wider uppercase">
                  🐾 Nền tảng SaaS cho Spa · Clinic · Pet Shop
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUpVariant} className="space-y-4">
              <h1
                className="text-slate-900 tracking-tight"
                style={{
                  fontSize: "clamp(2.5rem, 4.5vw, 3.8rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.035em",
                }}
              >
                Kỷ nguyên mới trong
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  vận hành Dịch vụ Thú cưng
                </span>
              </h1>
              <p
                className="text-slate-500 max-w-lg"
                style={{ fontSize: "1.05rem", fontWeight: 500, lineHeight: 1.65 }}
              >
                Nền tảng quản lý lịch hẹn, hồ sơ bệnh án thú y và bán hàng POS tinh gọn cho các Spa, Clinic và Pet Shop.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4 items-center pt-2">
              <button
                onClick={onRegister}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                  fontSize: "0.95rem",
                }}
              >
                Dùng thử miễn phí
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={onVideo}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-md text-slate-700 font-semibold transition-all duration-300 hover:bg-slate-50 hover:border-slate-350 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{
                  fontSize: "0.95rem",
                }}
              >
                <PlayCircle className="w-4.5 h-4.5 text-blue-600" />
                Xem demo 2 phút
              </button>
            </motion.div>
          </motion.div>

          {/* Right: Hero Image Mockup */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-white w-full max-w-[500px]"
              style={{
                border: "1px solid rgba(0, 0, 0, 0.08)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Light Browser Chrome */}
              <div
                className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100"
                style={{ background: "#f8fafc" }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div
                  className="ml-4 flex-1 rounded-md px-3 py-1 flex items-center justify-between"
                  style={{ background: "#ffffff", border: "1px solid #f1f5f9", maxWidth: "240px" }}
                >
                  <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 500 }}>🔒 app.pettech.io</span>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative group overflow-hidden" style={{ height: "300px" }}>
                <ImageWithFallback
                  src={heroImageUrl}
                  alt="PetTech Dashboard Mockup"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Floating Badge (Client count) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 hidden sm:flex"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg font-bold">
                  📈
                </div>
                <div>
                  <div className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wide">Hiệu suất tháng</div>
                  <div className="text-sm font-black text-slate-800">+35% Doanh thu</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Glowing Aura Behind Image */}
            <div
              className="absolute -z-10 rounded-full opacity-40 blur-3xl"
              style={{
                width: "350px",
                height: "350px",
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
                top: "50%",
                left: "50%",
                transform: "translate(-40%, -50%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
