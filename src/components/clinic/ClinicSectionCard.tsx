import React from "react";
import { LucideIcon } from "lucide-react";

interface ClinicSectionCardProps {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ClinicSectionCard({
  icon: Icon,
  title,
  iconColor = "#2563EB",
  badge,
  action,
  children,
  className = "",
}: ClinicSectionCardProps) {
  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white ${className}`}
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${iconColor}10` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: iconColor }} />
        </div>
        <span className="text-[0.95rem] font-black text-gray-900 tracking-tight">
          {title}
        </span>
        {badge && <div className="ml-2">{badge}</div>}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

