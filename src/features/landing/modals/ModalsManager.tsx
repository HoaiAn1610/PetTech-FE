import React from "react";
import { LoginModal } from "./LoginModal";
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
  const openRegister = () => onOpenModal("register");
  const openMigrationForm = () => onOpenModal("migration-form");

  return (
    <>
      <LoginModal 
        isOpen={activeModal === "login"} 
        onClose={onClose} 
        onSwitchToRegister={openRegister} 
      />
      
      <VideoModal 
        isOpen={activeModal === "video"} 
        onClose={onClose} 
        onRegister={openRegister} 
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
        onRegister={openRegister} 
      />
      <FeatureModal 
        type="feature-pos"
        isOpen={activeModal === "feature-pos"} 
        onClose={onClose} 
        onRegister={openRegister} 
      />
      <FeatureModal 
        type="feature-tracking"
        isOpen={activeModal === "feature-tracking"} 
        onClose={onClose} 
        onRegister={openRegister} 
      />
      <FeatureModal 
        type="feature-crm"
        isOpen={activeModal === "feature-crm"} 
        onClose={onClose} 
        onRegister={openRegister} 
      />
    </>
  );
}
