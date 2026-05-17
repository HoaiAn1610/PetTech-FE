import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { NavBar } from "@/components/shared/NavBar";
import { HeroSection } from "@/features/landing/HeroSection";
import { FeaturesGrid } from "@/features/landing/FeaturesGrid";
import { BusinessTypesSection } from "@/features/landing/BusinessTypesSection";
import { PricingSection } from "@/features/landing/PricingSection";
import { MigrationBanner } from "@/features/landing/MigrationBanner";
import { Footer } from "@/components/shared/Footer";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { ModalsManager, ModalType } from "@/features/landing/modals/ModalsManager";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import "@/styles/fonts.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1733783489145-f3d3ee7a9ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-open demo modal when ?demo=1 is in the URL
  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      setActiveModal("demo");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const close = () => setActiveModal(null);
  const open = (type: ModalType) => setActiveModal(type);

  const handleToast = (msg: string) => {
    toast.success(msg);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900" style={{ fontFamily: "Inter, sans-serif" }}>
      <Toaster position="top-center" richColors />
      
      <NavBar
        onLogin={() => open("login")}
        onDemo={() => open("demo")}
      />

      <main>
        <HeroSection
          heroImageUrl={HERO_IMAGE}
          onDemo={() => open("demo")}
          onVideo={() => open("video")}
        />

        <BusinessTypesSection 
          onDemo={() => open("demo")} 
        />

        <FeaturesGrid
          onLearnMore={(id) => open(`feature-${id}` as ModalType)}
        />

        <PricingSection 
          onDemo={() => open("demo")} 
        />

        <MigrationBanner
          onClaim={() => open("migration-form")}
          onGuide={() => open("migration-guide")}
        />
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
    </div>
  );
}
