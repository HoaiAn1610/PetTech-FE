import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { NavBar } from "@/components/shared/NavBar";
import { HeroSection } from "@/features/landing/HeroSection";
import { FeaturesGrid } from "@/features/landing/FeaturesGrid";
import { BusinessTypesSection } from "@/features/landing/BusinessTypesSection";
import { PricingSection } from "@/features/landing/PricingSection";
import { MigrationBanner } from "@/features/landing/MigrationBanner";
import { FAQSection } from "@/features/landing/FAQSection";
import { TestimonialsSection } from "@/features/landing/TestimonialsSection";
import { Footer } from "@/components/shared/Footer";
import { ModalsManager, ModalType } from "@/features/landing/modals/ModalsManager";
import { SocialFloatingButtons } from "@/components/shared/SocialFloatingButtons";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SEO } from "@/components/shared/SEO";
import { useScrollProgress } from "@/hooks/useScrollHooks";
import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import "@/styles/fonts.css";
import dashboardImg from "@/assets/pettech_dashboard.png";

const HERO_IMAGE = dashboardImg;

function SectionReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollProgress = useScrollProgress();

  // Auto-open register modal when ?demo=1 or ?register=1 is in the URL
  useEffect(() => {
    if (searchParams.get("demo") === "1" || searchParams.get("register") === "1") {
      setActiveModal("register");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Show/hide Back to Top button based on scroll depth
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const close = () => setActiveModal(null);
  const open = (type: ModalType) => setActiveModal(type);

  const handleToast = (msg: string) => {
    toast.success(msg);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 relative overflow-x-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── SEO & Meta Tags ── */}
      <SEO
        title="PetTech - Nền tảng Quản lý Spa & Clinic Thú Cưng B2B toàn diện"
        description="Phần mềm tối ưu vận hành cho phòng khám & spa thú cưng: Quản lý lịch hẹn thông minh, Kanban thực tế, AI cảnh báo dị ứng, eWallet & tích điểm Loyalty tự động."
        ogTitle="PetTech - Nền tảng Quản lý Spa & Clinic Thú Cưng B2B hàng đầu"
        ogDescription="Khám phá giải pháp vận hành tối ưu nhất cho Spa và Clinic Thú Cưng của bạn với các mô hình đồng bộ thời gian thực và quản lý tài chính eWallet thông minh."
        ogImage={HERO_IMAGE}
      />

      <Toaster position="top-center" theme="light" richColors />

      {/* ── Scroll Progress Bar ── */}
      <div 
        className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-100 ease-out z-[9999]" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <NavBar
        onLogin={() => open("login")}
        onRegister={() => open("register")}
      />

      <main>
        <SectionReveal>
          <HeroSection
            heroImageUrl={HERO_IMAGE}
            onRegister={() => open("register")}
          />
        </SectionReveal>

        <SectionReveal>
          <BusinessTypesSection 
            onRegister={() => open("register")} 
          />
        </SectionReveal>

        <SectionReveal>
          <FeaturesGrid
            onLearnMore={(id) => open(`feature-${id}` as ModalType)}
          />
        </SectionReveal>

        <SectionReveal>
          <PricingSection 
            onRegister={() => open("register")}
          />
        </SectionReveal>

        <SectionReveal>
          <MigrationBanner
            onClaim={() => open("migration-form")}
            onGuide={() => open("migration-guide")}
          />
        </SectionReveal>

        {/* ── FAQ Section (Collapsible Accordion with slide transitions) ── */}
        <FAQSection />

        {/* ── Testimonials Section (Autoplay Carousel slider) ── */}
        <TestimonialsSection />
      </main>

      <Footer onToast={handleToast} />
      
      {/* Modals orchestration */}
      <ModalsManager 
        activeModal={activeModal} 
        onClose={close} 
        onOpenModal={open} 
      />

      {/* Floating social chat buttons */}
      <SocialFloatingButtons />

      {/* ── Back to Top Button ── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-600 text-white shadow-2xl hover:bg-blue-700 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-pointer border border-blue-400 bottom-28 right-4 sm:bottom-36 sm:right-6"
          style={{ 
            boxShadow: "0 10px 30px rgba(37,99,235,0.4)" 
          }}
          title="Về đầu trang"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
