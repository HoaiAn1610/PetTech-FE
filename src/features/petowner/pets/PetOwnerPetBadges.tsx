import React from "react";
import { ShieldAlert } from "lucide-react";
import { PetAllergen } from "@/data/petProfiles";

// ─── Vaccine Badge ────────────────────────────────────────────────────────────
export function VaccineBadge({ status }: { status: "current" | "due-soon" | "overdue" }) {
  const cfg = {
    current:    { label: "Còn hạn",  bg: "rgba(22,163,74,0.08)",  color: "#16a34a", border: "rgba(22,163,74,0.25)"  },
    "due-soon": { label: "Sắp đến",  bg: "rgba(249,115,22,0.08)", color: "#F97316", border: "rgba(249,115,22,0.3)"  },
    overdue:    { label: "Quá hạn",  bg: "rgba(220,38,38,0.08)",  color: "#dc2626", border: "rgba(220,38,38,0.25)"  },
  }[status];
  return (
    <span className="px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: "0.68rem", fontWeight: 700, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
export function SeverityBadge({ severity }: { severity: PetAllergen["severity"] }) {
  const cfg = {
    mild:     { label: "Nhẹ",          bg: "rgba(249,115,22,0.1)",  color: "#ea580c", border: "rgba(249,115,22,0.25)" },
    moderate: { label: "Trung bình",   bg: "rgba(220,38,38,0.08)",  color: "#dc2626", border: "rgba(220,38,38,0.2)"   },
    severe:   { label: "NGHIÊM TRỌNG", bg: "rgba(124,58,237,0.1)",  color: "#7c3aed", border: "rgba(124,58,237,0.25)" },
  }[severity];
  return (
    <span className="px-2.5 py-1 rounded-full flex items-center gap-1"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: "0.65rem", fontWeight: 800, color: cfg.color }}>
      {severity === "severe" && <ShieldAlert className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
}

// ─── Lab Status Badge ─────────────────────────────────────────────────────────
export function LabBadge({ status }: { status: "normal" | "high" | "low" | "critical" }) {
  const cfg = {
    normal:   { label: "Bình thường", color: "#16a34a", bg: "rgba(22,163,74,0.08)",  border: "rgba(22,163,74,0.2)"   },
    high:     { label: "Cao",         color: "#ea580c", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.25)" },
    low:      { label: "Thấp",        color: "#2563EB", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.2)"   },
    critical: { label: "Nguy hiểm",   color: "#dc2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.25)"  },
  }[status];
  return (
    <span className="px-2 py-0.5 rounded-md"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, fontSize: "0.65rem", fontWeight: 700, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

// ─── Section Box ──────────────────────────────────────────────────────────────
export function SectionBox({ title, icon: Icon, children, iconColor = "#2563EB" }: {
  title: string; icon: React.ElementType; children: React.ReactNode; iconColor?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1.5px solid #e5e7eb", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${iconColor}12` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
        </div>
        <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── KPI Stat Card ────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon: Icon, color, bg }: {
  label: string; value: string; sub: string; icon: React.ElementType; color: string; bg: string;
}) {
  return (
    <div className="rounded-2xl px-4 py-4 flex flex-col gap-2.5" style={{ background: "white", border: "1.5px solid #e5e7eb" }}>
      <div className="flex items-center justify-between">
        <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em" }}>{label}</p>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{sub}</p>
    </div>
  );
}
