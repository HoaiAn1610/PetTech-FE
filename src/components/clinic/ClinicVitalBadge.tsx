import React from "react";
import { LucideIcon } from "lucide-react";

interface ClinicVitalBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  color: string;
  bg: string;
}

export function ClinicVitalBadge({
  icon: Icon,
  label,
  value,
  unit,
  color,
  bg,
}: ClinicVitalBadgeProps) {
  return (
    <div
      className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl flex-1"
      style={{ background: bg, border: `1px solid ${color}20` }}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={2.5} />
        <span
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            color,
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{unit}</span>
      </div>
    </div>
  );
}
