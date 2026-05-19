import React from "react";
import { AlertTriangle, HelpCircle, X } from "lucide-react";

interface ClinicConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClinicConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "danger",
  onConfirm,
  onCancel,
}: ClinicConfirmModalProps) {
  if (!isOpen) return null;

  // Curate harmonized styling based on variants
  const configs = {
    danger: {
      icon: AlertTriangle,
      iconColor: "#dc2626",
      iconBg: "rgba(220,38,38,0.08)",
      btnBg: "linear-gradient(135deg,#dc2626,#b91c1c)",
      btnShadow: "0 4px 12px rgba(220,38,38,0.2)",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "#d97706",
      iconBg: "rgba(217,119,6,0.08)",
      btnBg: "linear-gradient(135deg,#d97706,#b45309)",
      btnShadow: "0 4px 12px rgba(217,119,6,0.2)",
    },
    success: {
      icon: HelpCircle,
      iconColor: "#16a34a",
      iconBg: "rgba(22,163,74,0.08)",
      btnBg: "linear-gradient(135deg,#16a34a,#15803d)",
      btnShadow: "0 4px 12px rgba(22,163,74,0.2)",
    },
    info: {
      icon: HelpCircle,
      iconColor: "#2563EB",
      iconBg: "rgba(37,99,235,0.08)",
      btnBg: "linear-gradient(135deg,#2563EB,#1d4ed8)",
      btnShadow: "0 4px 12px rgba(37,99,235,0.2)",
    },
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(8px)",
        fontFamily: "Inter, sans-serif",
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white overflow-hidden flex flex-col p-6 text-center animate-in fade-in zoom-in-95 duration-200 relative"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>

        {/* Reusable Confirmation Icon */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: config.iconBg,
          }}
        >
          <Icon className="w-6 h-6" style={{ color: config.iconColor }} />
        </div>

        {/* Title & Message */}
        <h3 className="text-base font-black text-gray-800 mb-1.5 leading-snug">
          {title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6 px-2">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-bold text-xs rounded-xl"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-white transition-all font-black text-xs rounded-xl hover:opacity-95 active:scale-95 shadow-md"
            style={{
              background: config.btnBg,
              boxShadow: config.btnShadow,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
