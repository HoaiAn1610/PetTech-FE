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
import { ChatWidget } from "@/components/shared/ChatWidget";
import { ModalsManager, ModalType } from "@/features/landing/modals/ModalsManager";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { SEO } from "@/components/shared/SEO";
import { useScrollProgress, useEntranceReveal } from "@/hooks/useScrollHooks";
import { ArrowUp } from "lucide-react";
import "@/styles/fonts.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

function SectionReveal({ children }: { children: React.ReactNode }) {
  const { ref, isRevealed } = useEntranceReveal();
  return (
    <div
      ref={ref as any}
      className="transition-all duration-1000 ease-out"
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0)" : "translateY(30px)",
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollProgress = useScrollProgress();

  // Auto-open demo modal when ?demo=1 is in the URL
  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      setActiveModal("demo");
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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 relative" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── SEO & Meta Tags ── */}
      <SEO
        title="PetTech - Nền tảng Quản lý Spa & Clinic Thú Cưng B2B toàn diện"
        description="Phần mềm tối ưu vận hành cho phòng khám & spa thú cưng: Quản lý lịch hẹn thông minh, Kanban thực tế, AI cảnh báo dị ứng, eWallet & tích điểm Loyalty tự động."
        ogTitle="PetTech - Nền tảng Quản lý Spa & Clinic Thú Cưng B2B hàng đầu"
        ogDescription="Khám phá giải pháp vận hành tối ưu nhất cho Spa và Clinic Thú Cưng của bạn với các mô hình đồng bộ thời gian thực và quản lý tài chính eWallet thông minh."
        ogImage={HERO_IMAGE}
      />

      <Toaster position="top-center" richColors />

      {/* ── Scroll Progress Bar ── */}
      <div 
        className="fixed top-0 left-0 h-[4px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-100 ease-out z-[9999]" 
        style={{ width: `${scrollProgress}%` }}
      />
      
      <NavBar
        onLogin={() => open("login")}
        onDemo={() => open("demo")}
      />

      <main>
        <SectionReveal>
          <HeroSection
            heroImageUrl={HERO_IMAGE}
            onDemo={() => open("demo")}
            onVideo={() => open("video")}
          />
        </SectionReveal>

        <SectionReveal>
          <BusinessTypesSection 
            onDemo={() => open("demo")} 
          />
        </SectionReveal>

        <SectionReveal>
          <FeaturesGrid
            onLearnMore={(id) => open(`feature-${id}` as ModalType)}
          />
        </SectionReveal>

        <SectionReveal>
          <PricingSection 
            onDemo={() => open("demo")} 
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

      {/* Floating chat widget */}
      <ChatWidget />

      {/* ── Back to Top Button ── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl hover:bg-blue-700 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in-95 cursor-pointer border border-blue-400"
          style={{ boxShadow: "0 10px 30px rgba(37,99,235,0.4)" }}
          title="Về đầu trang"
        >
          <ArrowUp className="w-5 h-5" strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
