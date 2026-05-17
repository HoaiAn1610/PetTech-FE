import React from "react";

export type ClinicStatus = "Khoẻ mạnh" | "Chờ vaccine" | "Đang điều trị" | "Không hoạt động" | "Đang khám" | string;

interface ClinicStatusBadgeProps {
  status: ClinicStatus;
  customStyles?: { bg: string; text: string; dot: string };
}

const DEFAULT_STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  "Khoẻ mạnh":      { bg: "rgba(22,163,74,0.08)",   text: "#16a34a", dot: "#22c55e" },
  "Chờ vaccine":    { bg: "rgba(249,115,22,0.1)",   text: "#ea580c", dot: "#f97316" },
  "Đang điều trị":  { bg: "rgba(220,38,38,0.08)",   text: "#dc2626", dot: "#ef4444" },
  "Không hoạt động":{ bg: "rgba(107,114,128,0.1)", text: "#6b7280", dot: "#9ca3af" },
  "Đang khám":      { bg: "rgba(37,99,235,0.08)",   text: "#2563EB", dot: "#3b82f6" },
};

export function ClinicStatusBadge({ status, customStyles }: ClinicStatusBadgeProps) {
  const s = customStyles || DEFAULT_STATUS_STYLES[status] || {
    bg: "rgba(107,114,128,0.1)",
    text: "#6b7280",
    dot: "#9ca3af"
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.text }}>
        {status}
      </span>
    </span>
  );
}
