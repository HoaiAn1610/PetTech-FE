import React from "react";
import { X } from "lucide-react";

interface ClinicModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function ClinicModal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth = "max-w-2xl",
}: ClinicModalProps) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(6px)",
        fontFamily: "Inter, sans-serif",
      }}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} rounded-2xl bg-white overflow-hidden flex flex-col`}
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.25)", maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#111827" }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "2px" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="flex gap-2.5 px-7 pb-6 pt-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
