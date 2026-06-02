import React from "react";
import { LoginModal } from "./LoginModal";
import { DemoModal } from "./DemoModal";
import { VideoModal } from "./VideoModal";
import { FeatureModal } from "./FeatureModal";
import { MigrationFormModal } from "./MigrationFormModal";
import { MigrationGuideModal } from "./MigrationGuideModal";
import { DocsModal } from "./DocsModal";
import { RegisterModal } from "./RegisterModal";

export type ModalType = 
  | "login" 
  | "demo" 
  | "video" 
  | "migration-form" 
  | "migration-guide" 
  | "docs"
  | "register"
  | "feature-booking" 
  | "feature-pos" 
  | "feature-tracking" 
  | "feature-crm" 
  | null;

interface ModalsManagerProps {
  activeModal: ModalType;
  onClose: () => void;
  onOpenModal: (type: ModalType) => void;
}

export function ModalsManager({ activeModal, onClose, onOpenModal }: ModalsManagerProps) {
  const openDemo = () => onOpenModal("demo");
  const openMigrationForm = () => onOpenModal("migration-form");

  return (
    <>
      <LoginModal 
        isOpen={activeModal === "login"} 
        onClose={onClose} 
        onSwitchToDemo={openDemo} 
      />
      
      <DemoModal 
        isOpen={activeModal === "demo"} 
        onClose={onClose} 
      />
      
      <VideoModal 
        isOpen={activeModal === "video"} 
        onClose={onClose} 
        onBookDemo={openDemo} 
      />

      <MigrationFormModal 
        isOpen={activeModal === "migration-form"} 
        onClose={onClose} 
      />

      <MigrationGuideModal 
        isOpen={activeModal === "migration-guide"} 
        onClose={onClose} 
        onClaim={openMigrationForm}
      />

      <DocsModal
        isOpen={activeModal === "docs"}
        onClose={onClose}
      />

      <RegisterModal
        isOpen={activeModal === "register"}
        onClose={onClose}
      />

      <FeatureModal 
        type="feature-booking"
        isOpen={activeModal === "feature-booking"} 
        onClose={onClose} 
        onBookDemo={openDemo} 
      />
      <FeatureModal 
        type="feature-pos"
        isOpen={activeModal === "feature-pos"} 
        onClose={onClose} 
        onBookDemo={openDemo} 
      />
      <FeatureModal 
        type="feature-tracking"
        isOpen={activeModal === "feature-tracking"} 
        onClose={onClose} 
        onBookDemo={openDemo} 
      />
      <FeatureModal 
        type="feature-crm"
        isOpen={activeModal === "feature-crm"} 
        onClose={onClose} 
        onBookDemo={openDemo} 
      />
    </>
  );
}
